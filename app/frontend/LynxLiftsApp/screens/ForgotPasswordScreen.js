import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';
      
      console.log("Sending request to:", `${API_URL}/api/auth/forgot-password`);
  
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { 
        email,
        platform: Platform.OS, 
      });
  
      if (response.data.success) {
        Alert.alert("Check Your Email", "A password reset link has been sent.");
        navigation.navigate('Login');
      } else {
        throw new Error("No response from server");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
  
      if (error.response) {
        console.error("Server responded with:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received. Request details:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
  
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong, please try again.');
    }
  };  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
        placeholderTextColor="#FAF2E6"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Link</Text>
      </TouchableOpacity>

      <Text style={styles.backToSignIn} onPress={() => navigation.navigate('Login')}>
        Back to Sign In
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80A1C2',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FAF2E6',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 40,
    backgroundColor: '#BF4146',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
    color: '#FAF2E6',
    fontSize: 14,
  },
  button: {
    width: '30%',
    height: 40,
    backgroundColor: '#A62C2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 18,
    fontWeight: '600',
  },
  backToSignIn: {
    color: '#FAF2E6',
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen;
