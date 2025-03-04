import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const DriverScreen = ({ navigation }) => {
  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl font-bold text-gray-800">Welcome, Driver!</Text>
      <Text className="text-gray-600 mt-2 text-center">
        You can start accepting ride requests now.
      </Text>
      
      <TouchableOpacity 
        className="mt-6 bg-blue-600 px-4 py-2 rounded-xl"
        onPress={() => navigation.navigate('DriverDashboard')}
      >
        <Text className="text-white font-semibold">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverScreen;
