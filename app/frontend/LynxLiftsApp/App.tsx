import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/RegisterScreen';
import BufferScreen from './screens/BufferScreen';
import FeedScreen from './screens/FeedScreen';
import DriverScreen from './screens/DriverScreen';
import CreatePostScreen from './screens/CreatePostScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Welcome" component={BufferScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Driver" component={DriverScreen} />
        <Stack.Screen name="Post" component={CreatePostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
