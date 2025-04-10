import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StatusScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const driverID = user.rhodesid;
  const [status, setStatus] = useState(null);
  const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

  useEffect(() => {
    fetchStatus();
  }, []);
  useEffect(() => {
    if (status === true) {
      Alert.alert(
        "You're Online",
        "Do you want to view the ride feed?",
        [
          { text: "No", onPress: () => updateStatus(false) },
          { text: "Yes", onPress: () => navigation.navigate('DriverFeed', { user }) },
        ]
      );
    }
  }, [status]);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stat/get-status/${driverID}`);
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/stat/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driverID, status: newStatus }),
      });

      const data = await response.json();
      console.log(data.message);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Something went wrong. Try again.")
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Status</Text>
      <Text style={styles.subtitle}>
        You can only view ride requests when you're online.
      </Text>

      <Text style={styles.subtitle}>
        My current status: {status === null ? "Loading . . ." : status ? "Online" : "Offline"}
      </Text>
      <TouchableOpacity
      style={[styles.button, status ? styles.buttonActive : styles.onlineButton]}
      onPress={() => updateStatus(true)}
      disabled={status === true}
      >
    <Text style={styles.buttonText}>Online</Text>
      </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, status === false ? styles.buttonActive : styles.offlineButton]}
      onPress={() => updateStatus(false)}
      disabled={status === false}
    >
      <Text style={styles.buttonText}>Offline</Text>
    </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80A1C2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FAF2E6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: '#FAF2E6',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  onlineButton: {
    backgroundColor: '#A62C2C',
  },
  offlineButton: {
    backgroundColor: '#A62C2C',
  },
  buttonActive: {
    backgroundColor: '#BF4146',
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StatusScreen;
