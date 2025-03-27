import React, { useState } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import axios from 'axios';
import { Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
const path = require('path');

const serveResetForm = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Invalid reset link.');
  }

  // Serve the reset form HTML page
  res.send(`
    <html>
      <head><title>Reset Password</title></head>
      <body style="font-family: sans-serif; margin: 40px;">
        <h2>Reset Your Password</h2>
        <form method="POST" action="/api/auth/reset-password?token=${token}">
          <label>New Password:</label><br/>
          <input type="password" name="newPassword" required style="margin: 10px 0; padding: 8px; width: 300px;"><br/>
          <button type="submit" style="padding: 8px 16px;">Reset Password</button>
        </form>
      </body>
    </html>
  `);
};

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const route = useRoute();
  const { token } = route.params; // Get token from URL

  const handleReset = async () => {
    try {
      const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/auth/reset-password?token=${token}`, {
        newPassword,
      });

      if (response.data.message) {
        Alert.alert("Success", "Your password has been reset. You can now log in.");
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView>
      <Text>Enter New Password</Text>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity onPress={handleReset}>
        <Text>Reset Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
