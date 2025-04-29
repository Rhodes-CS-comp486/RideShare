import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, Alert, Dimensions, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { API_URL } from '@env'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.3 * SCREEN_WIDTH;

const DriverFeedScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [declined, setDeclined] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/feed`);
      console.log('All posts from backend:', response.data);
      const filtered = response.data.filter(post => (
        (post.ridestate === false || (post.ridestate === true && post.driverid === user.rhodesid)) &&
        post.passengerrhodesid !== user.rhodesid
      ));

      // Sort so accepted posts (driver's current rides) come first
      filtered.sort((a, b) => {
        const aPriority = a.ridestate === true && a.driverid === user.rhodesid ? 1 : 0;
        const bPriority = b.ridestate === true && b.driverid === user.rhodesid ? 1 : 0;
        return bPriority - aPriority; // Sort descending
      });
      setPosts(filtered);      
      checkRideCompletion(filtered);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    // Alert.alert("Logged in as", user.rhodesid);
    const unsubscribe = navigation.addListener('focus', fetchPosts);
    return unsubscribe;
  }, [navigation]);

  const markRideComplete = async (post) => {
    try {
      await axios.put(`${API_URL}/api/feed/complete`, {
        passengerrhodesid: post.passengerrhodesid,
        pickupdate: post.pickupdate,
        pickuptimestamp: post.pickuptimestamp
      });
      fetchPosts(); // refresh posts
    } catch (error) {
      console.error("Error marking ride complete:", error);
    }
  };
  
  const explainIncompleteRide = (post) => {
    navigation.navigate('ExplainRide', { post });
  };
  
  const checkRideCompletion = (postsToCheck) => {
    const now = new Date();
  
    postsToCheck.forEach(post => {
      if (post.ridestate && post.driverid === user.rhodesid) {
        const scheduledDateTime = new Date(post.pickuptimestamp);
  
        const timeDiffMs = now - scheduledDateTime;
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
  
        const isSameDay = now.toISOString().slice(0,10) === post.pickupdate;
  
        if (isSameDay || (timeDiffHours > 0 && timeDiffHours <= 12)) {
          if (post.drivercomplete == false && (!post.driverdescription || post.driverdescription.trim() === '')) {
            Alert.alert(
              "Ride Completion",
              `Did you complete the ride scheduled at ${post.pickuptime}?`,
              [
                { text: "Yes, Completed", onPress: () => markRideComplete(post) },
                { text: "No, Explain", onPress: () => explainIncompleteRide(post) }
              ]
            );
          }
        }
      }
    });
  };  

  const promptCancel = (item) => {
    Alert.alert(
      "Cancel Ride",
      "Do you want to cancel the ride?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => cancelRide(item) }
      ]
    );
  };

  const acceptPost = async (item) => {
    try {
      await axios.put(`${API_URL}/api/feed/accept`, {
        passengerrhodesid: item.passengerrhodesid,
        pickupdate: item.pickupdate,
        pickuptime: item.pickuptime,
        driverid: user.rhodesid
      });
      setPosts(prev => prev.map(p => {
        if (
          p.passengerrhodesid === item.passengerrhodesid &&
          p.pickupdate === item.pickupdate &&
          p.pickuptime === item.pickuptime
        ) {
          return { ...p, ridestate: true, driverid: user.rhodesid };
        }
        return p;
      }));
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const cancelRide = async (item) => {
    try {
      await axios.put(`${API_URL}/api/feed/cancel`, {
        passengerrhodesid: item.passengerrhodesid,
        pickupdate: item.pickupdate,
        pickuptime: item.pickuptime
      });
      setPosts(prev => prev.map(p => {
        if (
          p.passengerrhodesid === item.passengerrhodesid &&
          p.pickupdate === item.pickupdate &&
          p.pickuptime === item.pickuptime
        ) {
          return { ...p, ridestate: false, driverid: null };
        }
        return p;
      }));
    } catch (err) {
      console.error("Cancel ride failed:", err);
    }
  };

  const declinePost = (item) => {
    const idKey = `${item.passengerrhodesid}-${item.pickupdate}-${item.pickuptime}`;
    setDeclined(prev => [...prev, idKey]);
  };

  const SwipeableCard = ({ item }) => {
    const translateX = useSharedValue(0);
    const postKey = `${item.passengerrhodesid}-${item.pickupdate}-${item.pickuptime}`;

    const panGesture = Gesture.Pan()
      .onUpdate((e) => {
        translateX.value = e.translationX;
      })
      .onEnd(() => {
        if (translateX.value > SWIPE_THRESHOLD) {
          runOnJS(acceptPost)(item);
        } else if (translateX.value < -SWIPE_THRESHOLD) {
          if (item.ridestate === true && item.driverid === user.rhodesid) {
            runOnJS(promptCancel)(item);
          } else {
            runOnJS(declinePost)(item);
          }
        }
        translateX.value = withSpring(0);
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    if (declined.includes(postKey)) return null;

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[
        styles.post, 
        item.ridestate === true && item.driverid === user.rhodesid ? styles.acceptedPost : {}, 
        animatedStyle
      ]}>
        <View style={{ marginBottom: 8 }}>
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
         <TouchableOpacity 
            onPress={() => navigation.navigate('Report', { reportedUser: item.passengerrhodesid, currentUser: user.rhodesid, postInfo: item })}
            style={{ alignSelf: 'flex-end', marginTop: 10, marginRight: 10 }}
          >
            <Text style={styles.reportText}>Report Post</Text>
          </TouchableOpacity>
      </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <SwipeableCard item={item} />}
        />

        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.navigate('DriverFeed', { user: { rhodesid: user.rhodesid } })}>
            <Image source={require('../assets/home.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Driver')}> 
            <Image source={require('../assets/payment.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DriverChat', { user: { rhodesid: user.rhodesid } })}>
            <Image source={require('../assets/chat.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DriverAccount', { user: { rhodesid: user.rhodesid } })}>
            <Image source={require('../assets/setting.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80A1C2',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  post: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#6683A9',
    marginBottom: 10,
    backgroundColor: '#6683A9',
    borderRadius: 10,
  },
  acceptedPost: {
    backgroundColor: '#BF4146',
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
});

export default DriverFeedScreen;
