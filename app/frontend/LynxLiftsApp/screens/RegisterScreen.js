import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, Image, StyleSheet, View, Alert} from 'react-native';
import axios from 'axios';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env'
import { sendTokenToBackend } from './notificationService';

//import { useFonts } from 'expo-font';
//import { Poppins_400Regular } from '@expo-google-fonts/poppins'; 

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

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
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        username,
      });
      if (!response.data) {
        throw new Error("No response from server");
      }
      const { rhodesid } = response.data;

      //Send token to backend
      await notificationService.sendTokenToBackend(rhodesid);

      Alert.alert("User registered", "Verification email sent.");
      navigation.navigate('Login', {user: { username, rhodesid } });

    } catch (error) {
        console.error("Registration failed:", error);
        alert('Error: ' + (error.response?.data?.error || 'Something went wrong.'));
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/12.png')} style={styles.carImage} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
        placeholderTextColor="#FAF2E6"
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#FAF2E6"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.signInText}>
        Already have an account?{' '}
        <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>
          Sign In
        </Text>
      </Text>
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
  imageContainer: {
    position: 'relative',
    width: 300,
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: -10,
  },
  carImage: {
    width: 150,
    height: 150,
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
