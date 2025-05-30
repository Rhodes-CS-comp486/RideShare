import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, Image, StyleSheet, View, Alert } from 'react-native';
import axios from 'axios';
import { Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '@env'
import { sendTokenToBackend } from '../notificationService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  const route = useRoute();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (!response.data) {
        throw new Error("No response from server");
      }

      const { username, rhodesid } = response.data;
      
      console.log(rhodesid);
     
      //send token to backend after login
      await sendTokenToBackend(rhodesid);
      
      Alert.alert('Welcome Lynx!', 'You are now a lynx on the road');
      //Update the login state
      route.params.setIsLoggedIn(true);

      navigation.navigate('Welcome', { user: { username, rhodesid } });

    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } 
      
      else if (error.request) {
        console.log('No response received:', error.request);
      
      } 
      
      else {
        console.log('Error setting up request:', error.message);
      }

  Alert.alert('Login Failed', error.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/12.png')} style={styles.carImage} />
      </View>

      <View style={styles.emailContainer}>
        <TextInput
          style={styles.emailInput}
          placeholder="Rhodes ID"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          placeholderTextColor="#FAF2E6"
          autoCapitalize="none"
        />
        <Text style={styles.emailSuffix}>@rhodes.edu</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#FAF2E6"
      />   
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

      <Text style={styles.signUpText}>
        Have an account?{' '}
        <Text style={styles.signUpLink} onPress={() => navigation.navigate('Register')}>
          Sign Up
        </Text>
      </Text>
      <Text style={styles.sponsor}>
        Rhodes College Lynx Lifts Organization</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6683A9',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  carImage: {
    width: 150,
    height: 150,
    marginTop: -20,
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
    width: '50%',
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
  forgotPasswordText: {
    color: '#FAF2E6',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginTop: 15,
  },
  signUpText: {
    color: '#FAF2E6',
    marginTop: 5,
    fontSize: 14,
  },
  signUpLink: {
    color: '#FAF2E6',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BF4146',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
    width: '90%',
    height: 40,
  },
  emailInput: {
    flex: 1,
    color: '#FAF2E6',
    fontSize: 14,
  },
  emailSuffix: {
    color: '#FAF2E6',
    fontSize: 14,
    marginLeft: 5,
  },  
  sponsor: {
    color: '#FAF2E6',
    marginTop: 15,
    fontSize: 12,
  },
});

export default LoginScreen;
