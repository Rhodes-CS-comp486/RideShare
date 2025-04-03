import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';

const SetPreferenceScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [radius, setRadius] = useState(10);
  const [time, setTime] = useState(10);

  const handleSave = () => {
    navigation.navigate('DriverAccount', { user: { ...user, radius, time } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Preferred Driving Distance</Text>
      <Text style={styles.valueText}>{radius} miles</Text>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={100}
          step={1}
          value={radius}
          onValueChange={setRadius}
          minimumTrackTintColor="#4A90E2" 
          maximumTrackTintColor="#D3D3D3" 
          thumbTintColor='#A62C2C' 
        />
      </View>

      <Text style={styles.title}>Set Your Preferred Drive Time</Text>
      <Text style={styles.valueText}>{time} min</Text>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={100}
          step={1}
          value={time}
          onValueChange={setTime}
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor='#A62C2C'
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
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