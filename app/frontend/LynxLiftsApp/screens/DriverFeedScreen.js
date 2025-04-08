import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

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

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>You are now online and ready to receive ride requests.</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('DriverAccount', { user })}
      >
        <Text style={styles.buttonText}>My Account</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postText}>Rhodes ID: {item.passengerrhodesid}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80A1C2',
    padding: 20,
  },
  subtitle: {
    fontSize: 17,
    color: '#FAF2E6',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#A62C2C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: '600',
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
  }
});

export default DriverFeedScreen;