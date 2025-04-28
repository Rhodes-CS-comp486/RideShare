import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const ReportScreen = ({ route, navigation }) => {
  const { reportedUser, currentUser, postInfo } = route.params;
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  
  if (reportedUser === currentUser) {
    Alert.alert('Silly Goose', 'You cannot report yourself.', [
        { text: 'I understand', onPress: () => navigation.navigate('Feed', { user: { rhodesid: currentUser } }) }
      ]);
  }

  const submitReport = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for the report.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/report`, {
        reporter: currentUser,
        reported: reportedUser,
        reason,
        details,
        postInfo,
      });

      Alert.alert('Success', 'Your report has been submitted.');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'There was a problem submitting your report.');
    }
  };

  return (
    <View style={styles.container}>
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

    <View style={{ paddingTop: 100 }}>
    <Text style={styles.title}>You are reporting: {reportedUser}</Text>

    <TextInput
      placeholder="Reason for report"
      placeholderTextColor="#ccc"
      value={reason}
      onChangeText={setReason}
      style={styles.input}
    />

    <TextInput
      placeholder="Additional details (optional)"
      placeholderTextColor="#ccc"
      value={details}
      onChangeText={setDetails}
      style={[styles.input, { height: 100 }]}
      multiline
    />

    <TouchableOpacity style={styles.button} onPress={submitReport}>
      <Text style={styles.buttonText}>Submit Report</Text>
    </TouchableOpacity>
    </View>
</View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#80A1C2', 
    padding: 20 
},
  title: { 
    color: '#FAF2E6', 
    fontSize: 20, 
    marginBottom: 10 
},
  input: { 
    backgroundColor: '#6683A9', 
    color: '#FAF2E6', 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 10 
},
  button: { 
    backgroundColor: '#A62C2C', 
    padding: 15, borderRadius: 20, 
    alignItems: 'center', 
    marginTop: 10 
},
  buttonText: { 
    color: '#FAF2E6', 
    fontSize: 16 
},
});

export default ReportScreen;
