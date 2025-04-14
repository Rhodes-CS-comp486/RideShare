import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env'

const SetPreferenceScreen = ({ route }) => {
  const navigation = useNavigation();
  const [radius, setRadius] = useState('');
  const [time, setTime] = useState('');
  

  const savePreferences = async () => {
    const driverid = route?.params?.user?.rhodesid;
    try {
      const response = await fetch(`${API_URL}/api/set-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          driverid: driverid,
          radius: radius,
          time: time
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to save preferences:", data.message || data);
        Alert.alert("Error", data.message || "Something went wrong.");
        return;
      }

      console.log("Preferences saved:", data);
      navigation.navigate('DriverAccount', { user: { rhodesid: driverid } });
      Alert.alert("Success", "Preferences updated successfully!");
    } catch (error) {
      console.error("Network or fetch error:", error.message || error);
      Alert.alert("Error", "Unable to save preferences.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Preferred Driving Distance</Text>
      <Text style={styles.valueText}>{radius} miles</Text>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={3}
          maximumValue={50}
          step={1}
          value={radius}
          onValueChange={(value) => setRadius(value)}
          minimumTrackTintColor="#BF4146"
          maximumTrackTintColor="#FAF2E6"
          thumbTintColor="#A62C2C"
        />
      </View>

      <Text style={styles.title}>Set Your Preferred Drive Time</Text>
      <Text style={styles.valueText}>{time} minutes</Text>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={60}
          step={5}
          value={time}
          onValueChange={(value) => setTime(value)}
          minimumTrackTintColor="#BF4146"
          maximumTrackTintColor="#FAF2E6"
          thumbTintColor="#A62C2C"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={savePreferences}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80A1C2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FAF2E6',
    marginBottom: 5,
  },
  valueText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FAF2E6',
    marginBottom: 10,
  },
  sliderContainer: {
    width: 350,
    paddingVertical: 10,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 50,
  },
  button: {
    backgroundColor: '#A62C2C',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SetPreferenceScreen;