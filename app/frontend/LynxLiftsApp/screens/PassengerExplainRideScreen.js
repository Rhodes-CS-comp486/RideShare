import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const PassengerExplainRideScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [explanation, setExplanation] = useState('');

  const submitExplanation = async () => {
    if (!explanation.trim()) {
      Alert.alert('Error', 'Please provide an explanation.');
      return;
    }

    try {
      await axios.put(`${API_URL}/api/feed/passengerexplain`, {
        passengerrhodesid: post.passengerrhodesid,
        pickupdate: post.pickupdate,
        pickuptime: post.pickuptime,
        passengerdescription: explanation,
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
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 64 : 44,
          left: 18,
          zIndex: 999,
          backgroundColor: '#FAF2E6',
          borderRadius: 16,
          padding: 6,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Image
          source={require('../assets/x.png')}
          style={{ width: 20, height: 20, tintColor: '#6683A9' }}
          resizeMode="contain"
        />
      </TouchableOpacity>
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
  title: { color: '#FAF2E6', fontSize: 20, marginBottom: 20, marginTop: 100 },
  input: { backgroundColor: '#6683A9', color: '#FAF2E6', padding: 10, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#A62C2C', padding: 15, borderRadius: 20, alignItems: 'center' },
  buttonText: { color: '#FAF2E6', fontSize: 16 },
});

export default PassengerExplainRideScreen;
