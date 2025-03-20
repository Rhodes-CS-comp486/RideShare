import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, Image, StyleSheet, View, Alert } from 'react-native';
import axios from 'axios';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (!response.data) {
        throw new Error("No response from server");
      }

      const { username, rhodesid } = response.data;
      alert("Login Successful");
      navigation.navigate('Welcome', { user: { username, rhodesid } });

    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert('Login Failed', error.response?.data?.error || 'Invalid email or password, please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/tire.png')} style={styles.tireImage} />
        <Image source={require('../assets/car.png')} style={styles.carImage} />
        <Text style={styles.title}>LynxLifts</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#FAF2E6"
      />

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

      <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

      <Text style={styles.signUpText}>
        Have an account?{' '}
        <Text style={styles.signUpLink} onPress={() => navigation.navigate('Register')}>
          Sign Up
        </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  carImage: {
    width: 100,
    height: 100,
    marginTop: -20,
  },
  tireImage: {
    width: 300,
    height: 100,
    position: 'absolute',
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
});

export default LoginScreen;
