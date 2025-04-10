import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, Alert, Dimensions, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.3 * SCREEN_WIDTH;

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

const SwipeableCard = ({ item, onAccept, onDecline }) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(onAccept)();
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(onDecline)();
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.post, animatedStyle]}>
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

const DriverFeedScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/feed`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAccept = () => {
    Alert.alert("Accepted", "Ride request has been accepted!");
  };

  const handleDecline = () => {
    Alert.alert("Declined", "Ride request has been declined.");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <SwipeableCard
              item={item}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          )}
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
    padding: 20,
  },
  post: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#6683A9',
    marginBottom: 10 
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