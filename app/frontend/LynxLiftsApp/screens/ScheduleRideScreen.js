import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ScheduleRideScreen = ({ route }) => {
  const { user, driver } = route.params;

  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const navigation = useNavigation();

  const handleSchedule = () => {
    if (!pickupDate || !pickupTime || !pickupLocation || !dropoffLocation) {
      Alert.alert('Missing Fields', 'Please fill in all the fields.');
      return;
    }

    navigation.navigate('PassengerChat', {
      user,
      driver,
      pickupdate: pickupDate,
      pickuptime: pickupTime,
      pickuplocation: pickupLocation,
      dropofflocation: dropoffLocation
    });
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>Pickup Date (MM-DD-YYYY)</Text>
          <TextInput
            style={styles.input}
            placeholder="2025-05-01"
            placeholderTextColor="#80A1C2"
            value={pickupDate}
            onChangeText={setPickupDate}
          />

          <Text style={styles.label}>Pickup Time</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM (AM/PM)"
            placeholderTextColor="#80A1C2"
            value={pickupTime}
            onChangeText={setPickupTime}
          />

          <Text style={styles.label}>Pickup Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Dorms"
            placeholderTextColor="#80A1C2"
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />

          <Text style={styles.label}>Dropoff Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Airport"
            placeholderTextColor="#80A1C2"
            value={dropoffLocation}
            onChangeText={setDropoffLocation}
          />

          <View style={styles.button}>
            <Button title="Schedule" onPress={handleSchedule} color="#FAF2E6" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80A1C2',
  },
  form: {
    padding: 20,
    paddingTop: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
    color: '#FAF2E6'
  },
  input: {
    borderWidth: 1,
    borderColor: '#6683A9',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: '#6683A9',
    color: '#FAF2E6',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#A62C2C',
    borderRadius: 25,
  },
});

export default ScheduleRideScreen;