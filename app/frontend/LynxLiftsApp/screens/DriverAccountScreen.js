import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

const DriverAccountScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stat/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driverID: user.rhodesid, status: false }),
      });

      const data = await response.json();
      console.log("Logout status update:", data.message);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Account</Text>
      <Text style={styles.subtitle}>Name: {user.name}</Text>
      <Text style={styles.subtitle}>Rhodes ID: {user.rhodesid}</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('SetPreference', { user })}
      >
        <Text style={styles.buttonText}>Set Radius</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Log Out</Text>
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
    backgroundColor: '#A62C2C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#A62C2C',
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverAccountScreen;
