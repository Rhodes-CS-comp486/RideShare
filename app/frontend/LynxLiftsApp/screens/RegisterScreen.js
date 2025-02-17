import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', { 
        email,
        password,
        username,
      });
      Alert.alert('Success', response.data.message);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong.');
    }
  };

  return React.createElement(
    SafeAreaView,
    { style: styles.container },
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'Email',
      value: email,
      onChangeText: setEmail,
    }),
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'Username',
      value: password,
      onChangeText: setUsername,
      secureTextEntry: true,
    }),
    React.createElement(TextInput, {
      style: styles.input,
      placeholder: 'Password',
      value: username,
      onChangeText: setPassword,
    }),
    React.createElement(Button, {
      title: 'Register',
      onPress: handleRegister,
    })
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;
