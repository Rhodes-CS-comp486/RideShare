import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import axios from 'axios';
//import { useFonts } from 'expo-font';
//import { Poppins_400Regular } from '@expo-google-fonts/poppins'; 

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //const [fontsLoaded] = useFonts({
    //Poppins_400Regular,
  //});

  //if (!fontsLoaded) {
    //return null;
  //}

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {

      const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        username,
      });
      alert('Success: ' + response.data.message);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Something went wrong.'));
    }
  };

  return React.createElement(
    SafeAreaView,
    { style: styles.container },
    React.createElement(View, { style: styles.header },
      React.createElement(Image, { source: require('../assets/tire.png'), style: styles.tireImage }),
      React.createElement(Image, { source: require('../assets/car.png'), style: styles.carImage }),
      React.createElement(Text, { style: styles.title }, 'Welcome to LynxLifts')
    ),
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'email',
      value: email,
      onChangeText: setEmail,
      placeholderTextColor: '#FAF2E6'
    }),
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'username',
      value: username,
      onChangeText: setUsername,
      placeholderTextColor: '#FAF2E6'
    }),
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'password',
      value: password,
      onChangeText: setPassword,
      secureTextEntry: true,
      placeholderTextColor: '#FAF2E6'
    }),
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'confirmed password',
      value: confirmPassword,
      onChangeText: setConfirmPassword,
      secureTextEntry: true,
      placeholderTextColor: '#FAF2E6'
    }),
    React.createElement(TouchableOpacity, { style: styles.button, onPress: handleRegister },
      React.createElement(Text, { style: styles.buttonText }, 'sign up')
    ),
    React.createElement(Text, { style: styles.signInText }, 'Already have an account? ',
      React.createElement(Text, { style: styles.signInLink }, 'Sign in')
    )
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
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 300,
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: -10,
  },
  carImage: {
    width: 100,
    height: 100,
    zIndex: 1,
    marginTop: -20,
  },
  tireImage: {
    width: 300,
    height: 100,
    position: 'absolute',
    zIndex: 0,
    opacity: 0.6,
    transform: [{ rotate: '90deg' }],
  },
  title: {
    fontSize: 32,
    color: '#FAF2E6',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
  },
  signInText: {
    color: '#FAF2E6',
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  signInLink: {
    color: '#FAF2E6',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontFamily: 'Poppins',
  }
});

export default RegisterScreen;
