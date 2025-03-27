import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DriverFeedScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>You are now online and ready to receive ride requests.</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('DriverAccountScreen', { user })}
      >
        <Text style={styles.buttonText}>My Account</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FAF2E6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: '#FAF2E6',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#A62C2C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverFeedScreen;