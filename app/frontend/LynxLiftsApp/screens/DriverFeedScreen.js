import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, Alert, Dimensions, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.3 * SCREEN_WIDTH;
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

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
      console.log('Filtered posts for feed:', filtered);
      setPosts(filtered);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    // Alert.alert("Logged in as", user.rhodesid);
    const unsubscribe = navigation.addListener('focus', fetchPosts);
    return unsubscribe;
  }, [navigation]);

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
        <Animated.View style={[styles.post, item.ridestate === true && item.driverid === user.rhodesid ? styles.acceptedPost : {}, animatedStyle]}>
          <Text style={styles.postText}>Rhodes ID: {item.passengerrhodesid}</Text>
          <Text style={styles.postText}>Pickup Time: {item.pickuptime}</Text>
          <Text style={styles.postText}>Pickup Location: {item.pickuplocation}</Text>
          <Text style={styles.postText}>Dropoff Location: {item.dropofflocation}</Text>
          <Text style={styles.postText}>Payment: {item.payment}</Text>
          <Text style={styles.postText}>Distance: {item.distance}</Text>
          <Text style={styles.postText}>Duration: {item.duration}</Text>
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
});

export default DriverFeedScreen;
