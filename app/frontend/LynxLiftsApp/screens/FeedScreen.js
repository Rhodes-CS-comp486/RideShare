import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import axios from 'axios';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { API_URL } from '@env'

const FeedScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [posts, setPosts] = useState([]);

  // function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/feed`);
      console.log("Fetched posts:", response.data); 
      const visiblePosts = response.data.filter(
        post => !post.ridestate || post.passengerrhodesid === user.rhodesid
      );
      
      // Sort so posts with ridestate === true and owned by user are first
      visiblePosts.sort((a, b) => {
        const aPriority = a.ridestate === true && a.passengerrhodesid === user.rhodesid ? 1 : 0;
        const bPriority = b.ridestate === true && b.passengerrhodesid === user.rhodesid ? 1 : 0;
        return bPriority - aPriority; // Sort descending
      });
      
      setPosts(visiblePosts);      
    } 
    catch (error) {
      console.error("Error fetching posts:", error);
    }
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
  
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.swipeablePost, animatedStyle]}>
        <View style={[ styles.post, item.ridestate === true && item.passengerrhodesid === user.rhodesid && { backgroundColor: '#BF4146' } ]}>
            <Text style={styles.postText}>Rhodes ID: {item.passengerrhodesid}</Text>
            <Text style={styles.postText}>Pickup Date: {item.pickupdate}</Text>
            <Text style={styles.postText}>Pickup Time: {item.pickuptime}</Text>
            <Text style={styles.postText}>Pickup Location: {item.pickuplocation}</Text>
            <Text style={styles.postText}>Dropoff Location: {item.dropofflocation}</Text>
            <Text style={styles.postText}>Payment: {item.payment}</Text>
            <Text style={styles.postText}>Distance: {item.distance}</Text>
            <Text style={styles.postText}>Duration: {item.duration}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  };  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts(); // Refresh feed on screen focus
    });
  
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
        <TouchableOpacity onPress={() => navigation.navigate('Feed', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Browse', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/driver.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PassengerChat', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/chat.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PassengerAccount', { user: { rhodesid: user.rhodesid } })}>
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
});

export default FeedScreen;