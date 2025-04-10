import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

const FeedScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [posts, setPosts] = useState([]);

  // function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/feed`);
      setPosts(response.data);
    } 
    catch (error) {
      console.error("Error fetching posts:", error);
    }
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
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postText}>Rhodes ID: {item.passengerrhodesid}</Text>
            <Text style={styles.postText}>Pickup Date: {item.pickupdate}</Text>
            <Text style={styles.postText}>Pickup Time: {item.pickuptime}</Text>
            <Text style={styles.postText}>Pickup Location: {item.pickuplocation}</Text>
            <Text style={styles.postText}>Dropoff Location: {item.dropofflocation}</Text>
            <Text style={styles.postText}>Ride State: {item.ridestate}</Text>
            <Text style={styles.postText}>Payment: {item.payment}</Text>
            <Text style={styles.postText}>Distance: {item.distance}</Text>
            <Text style={styles.postText}>Duration: {item.duration}</Text>
          </View>
        )}
      />
      
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Feed', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Driver')}>
          <Image source={require('../assets/driver.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { user: { rhodesid: user.rhodesid } })}>
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
    padding: 20,
  },
  createPostButton: {
    backgroundColor: '#A62C2C',
    padding: 12,
    borderRadius: 8,
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
    marginBottom: 10,
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
  }  
});

export default FeedScreen;