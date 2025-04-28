import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const ExplainRideScreen = ({ route, navigation }) => {
  const { post, user } = route.params;
  const [explanation, setExplanation] = useState('');

  const submitExplanation = async () => {
    if (!explanation.trim()) {
      Alert.alert('Error', 'Please provide an explanation.');
      return;
    }

    try {
      await axios.put(`${API_URL}/api/feed/explain`, {
        passengerrhodesid: post.passengerrhodesid,
        pickupdate: post.pickupdate,
        pickuptime: post.pickuptime,
        driverdescription: explanation,
      });

      Alert.alert('Submitted', 'Explanation submitted successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);      
    } catch (error) {
      console.error('Error submitting explanation:', error);
      Alert.alert('Error', 'Failed to submit explanation.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explain Incomplete Ride</Text>

      <TextInput
        placeholder="Enter explanation ..."
        placeholderTextColor="#ccc"
        value={explanation}
        onChangeText={setExplanation}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={submitExplanation}>
        <Text style={styles.buttonText}>Submit Explanation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#80A1C2', padding: 20 },
  title: { color: '#FAF2E6', fontSize: 20, marginBottom: 20 },
  input: { backgroundColor: '#6683A9', color: '#FAF2E6', padding: 10, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#A62C2C', padding: 15, borderRadius: 20, alignItems: 'center' },
  buttonText: { color: '#FAF2E6', fontSize: 16 },
});

export default ExplainRideScreen;
