import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import axios from 'axios';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { API_URL } from '@env'

const avatarImages = {
  'billy.png': require('../assets/avatars/billy.png'),
  'crosby.png': require('../assets/avatars/crosby.png'),
  'matthew.png': require('../assets/avatars/matthew.png'),
  'nalvi.png': require('../assets/avatars/nalvi.png'),
};

const FeedScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [posts, setPosts] = useState([]);
  const [acceptedRide, setAcceptedRide] = useState(null);

  // function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/feed`);
      console.log("Fetched posts:", response.data); 
      const now = new Date(); 
      const visiblePosts = response.data.filter( post => {
        const bothCompleted = post.passengercomplete === true && post.drivercomplete === true;
        const bothExplained = post.passengerdescription != null && post.driverdescription != null;

        const postTime = new Date(post.pickuptimestamp);
        const isOutdated = post.ridestate === false && now > postTime;
      
        return (
          (post.ridestate === false || (post.ridestate === true && post.passengerrhodesid === user.rhodesid)) &&
          post.driverid !== user.rhodesid && !bothCompleted && !bothExplained && !isOutdated
        );
      });
      
      // Sort so posts with ridestate === true and owned by user are first
      visiblePosts.sort((a, b) => {
        const aPriority = a.ridestate === true && a.passengerrhodesid === user.rhodesid ? 1 : 0;
        const bPriority = b.ridestate === true && b.passengerrhodesid === user.rhodesid ? 1 : 0;
        return bPriority - aPriority; // Sort descending
      });

      const topAcceptedPost = visiblePosts.find(
        post => post.ridestate === true && post.passengerrhodesid === user.rhodesid
      );
      
      setAcceptedRide(topAcceptedPost || null);
      setPosts(visiblePosts); 
      checkPassengerRideCompletion(visiblePosts);     
    } 
    catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const markPassengerRideComplete = async (post) => {
    try {
      await axios.put(`${API_URL}/api/feed/passengercomplete`, {
        passengerrhodesid: post.passengerrhodesid,
        pickupdate: post.pickupdate,
        pickuptimestamp: post.pickuptimestamp,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error marking passenger ride complete:", error);
    }
  };  

  const explainPassengerIncompleteRide = (post) => {
    navigation.navigate('PassengerExplainRide', { post }); 
  };  

  const checkPassengerRideCompletion = (postsToCheck) => {
    const now = new Date();
  
    postsToCheck.forEach(post => {
      if (post.ridestate && post.passengerrhodesid === user.rhodesid) {
        const scheduledDateTime = new Date(post.pickuptimestamp);

        const timeDiffMs = now - scheduledDateTime;
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

        const isSameDay = now.toISOString().slice(0,10) === post.pickupdate;
  
        if (isSameDay || (timeDiffHours > 0 && timeDiffHours <= 12)) {
          if (post.passengercomplete === false && (!post.passengerdescription || post.passengerdescription.trim() === '')) {
            Alert.alert(
              "Ride Completion",
              `Did you complete the ride scheduled at ${post.pickuptime}?`,
              [
                { text: "Yes, Completed", onPress: () => markPassengerRideComplete(post) },
                { text: "No, Explain", onPress: () => explainPassengerIncompleteRide(post) }
              ]
            );
          }
        }
      }
    });
  };  

  const deletePost = async (item) => {
    try {
      const encodedPickupDate = encodeURIComponent(item.pickupdate);
      const encodedPickupTime = encodeURIComponent(item.pickuptime);
      const encodedRhodesId = encodeURIComponent(item.passengerrhodesid);
  
      const url = `${API_URL}/api/feed/${encodedRhodesId}/${encodedPickupDate}/${encodedPickupTime}`;
      
      await axios.delete(url);
  
      setPosts(prev => prev.filter(p =>
        !(p.passengerrhodesid === item.passengerrhodesid &&
          p.pickupdate === item.pickupdate &&
          p.pickuptime === item.pickuptime)
      ));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };  

  const RenderPost = ({ item }) => {
    const translateX = useSharedValue(0);
    const threshold = -100;
    const avatarSource = avatarImages[item.passenger_profile_picture]
    const driverAvatar = avatarImages[item.driver_profile_picture];
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));
  
    const gesture = Gesture.Pan()
      .onUpdate((e) => {
        if (e.translationX < 0) {
          translateX.value = e.translationX;
        }
      })
      .onEnd(() => {
        if (translateX.value < threshold) {
          if (user.rhodesid === item.passengerrhodesid) {
            translateX.value = withSpring(-500, {}, () => {
              runOnJS(deletePost)(item);
            });
          } else {
            // bounce back if user is not the post owner
            translateX.value = withSpring(0);
          }
        } else {
          translateX.value = withSpring(0);
        }
      });
    
    const navigateToChat = () => {
      navigation.navigate('PassengerChat', {
        user: { rhodesid: user.rhodesid },
        driver: { rhodesid: item.driverid },
        pickupdate: item.pickupdate,
        pickuptime: item.pickuptime 
      });
    };
  
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.swipeablePost, animatedStyle]}>
        <View style={[
          styles.post, 
          item.ridestate === true && item.passengerrhodesid === user.rhodesid && { backgroundColor: '#BF4146' }
        ]}>
          <View style={{ marginBottom: 8 }}>
          {avatarSource && (
            <TouchableOpacity 
            onPress={() => {
              if (user.rhodesid === item.passengerrhodesid) {
                navigation.navigate('PassengerAccount', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } });
              } else {
                navigation.navigate('ViewPassengerAccount', { user: { rhodesid: item.passengerrhodesid, profile_picture: user.profile_picture }, currentUserId: user.rhodesid });
              }
            }}
            style={{ position: 'absolute', right: 5, zIndex: 10, elevation: 10 }}
          >
            <Image source={avatarSource} style={{ width: 47, height: 47, borderRadius: 25 }} />
          </TouchableOpacity>          
          )}
          {item.ridestate && item.driverid && (
            <TouchableOpacity
              onPress={() => {
                if (item.driverid === user.rhodesid) {
                  navigation.navigate('DriverAccount', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } });
                } else {
                  navigation.navigate('ViewDriverAccount', { user: { rhodesid: item.driverid, profile_picture: item.driver_profile_picture }, currentUserId: user.rhodesid });
                }
              }}
              style={{ position: 'absolute', right: 60, zIndex: 10, elevation: 10 }}
            >
              <Image
                source={driverAvatar}
                style={{ width: 47, height: 47, borderRadius: 25 }}
              />
            </TouchableOpacity>
          )}
            <Text style={styles.headerText}>{item.pickupdate} at {item.pickuptime}</Text>
            <Text style={styles.subHeaderText}>Passenger: {item.passengerrhodesid}</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Pickup:</Text>
            <Text style={styles.postText}>{item.pickuplocation}</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Dropoff:</Text>
            <Text style={styles.postText}>{item.dropofflocation}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <View>
              <Text style={styles.label}>Payment</Text>
              <Text style={styles.postText}>{item.payment}</Text>
            </View>
            <View>
              <Text style={styles.label}>Distance</Text>
              <Text style={styles.postText}>{item.distance}</Text>
            </View>
            <View>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.postText}>{item.duration}</Text>
            </View>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Estimated Cost</Text>
            <Text style={styles.postText}>${item.estimatedpayment}</Text>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Additional Notes:</Text>
            <Text style={styles.postText}>{item.addcomments}</Text>
          </View>
          <View style={styles.bottomRow}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Report', { reportedUser: item.passengerrhodesid, currentUser: user.rhodesid, postInfo: item })}
              style={{ alignSelf: 'flex-end', marginTop: 10, marginRight: 10 }}
            >
              <Text style={styles.reportText}>Report Post</Text>
            </TouchableOpacity>
            {
            
            item.ridestate === true && item.passengerrhodesid === user.rhodesid && item.driverid && (
            <>
            <TouchableOpacity
            style={styles.chatButton}
            onPress={navigateToChat}
            >
              <Text style={styles.chatButtonText}>Chat with Driver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
              style={[styles.chatButton, { backgroundColor: '#A62C2C', marginTop: 10 }]}
              onPress={async () => {
                try {
                  const response = await axios.get(`${API_URL}/api/auth/driver/${item.driverid}/payment`);
                  const {
                    venmo_handle,
                    cashapp_handle,
                    zelle_contact,
                    paypal_handle,
                    other_payment
                  } = response.data;
                  
                  let message = 'Choose a payment method:\n';
                  if (venmo_handle) message += `Venmo: ${venmo_handle}\n`;
                  if (cashapp_handle) message += `Cash App: ${cashapp_handle}\n`;
                  if (zelle_contact) message += `Zelle: ${zelle_contact}\n`; 
                  if (paypal_handle) message += `PayPal: ${paypal_handle}\n`;
                  if (other_payment) message += `Cash/Other: ${other_payment}`;
                  
                  Alert.alert('Pay Your Driver', message);
                } catch (err) {
                  
                  Alert.alert('Error', 'Unable to fetch payment options.');
                
                }
              }}
              
              >
                
                <Text style={[styles.chatButtonText, { color: '#FAF2E6' }]}>Pay Driver</Text>
                
                </TouchableOpacity>
                
                </>
              )
              }


            </View>
        </View>
        </Animated.View>
      </GestureDetector>
    );
  };  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPosts);
    return unsubscribe; // Clean up the listener on unmount
  }, [navigation]);

  const addPost = async (newPost) => {
    try {
      await axios.post(`${API_URL}/api/feed`, newPost);
      fetchPosts(); // Refresh posts after adding a new one
    } 
    catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.createPostButton} 
        onPress={() => navigation.navigate('Post', { addPost, user })}
      >
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>

      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <RenderPost item={item} />}
      />
      
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Feed', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Browse', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/driver.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PassengerConversations', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/chat.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PassengerAccount', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/setting.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#80A1C2',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  createPostButton: {
    backgroundColor: '#A62C2C',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#FAF2E6', 
    fontSize: 16,
  },
  post: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#6683A9',
  },
  postText: {
    color: '#FAF2E6', 
    fontSize: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#6683A9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 50,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  swipeablePost: {
    backgroundColor: '#6683A9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },   
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FAF2E6',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#FAF2E6',
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    color: '#FFCE67',
    fontWeight: 'bold',
  },
  reportText: {
    color: '#FFCE67',
    textDecorationLine: 'underline',
    fontSize: 14,
  },  
  chatButton: {
    backgroundColor: '#FFCE67',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  chatButtonText: {
    color: '#A62C2C',
    fontSize: 16,
    fontWeight: 'bold',
  },  
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default FeedScreen;