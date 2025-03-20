import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/RegisterScreen';
import BufferScreen from './screens/BufferScreen';
import FeedScreen from './screens/FeedScreen';
import StatusScreen from './screens/StatusScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPassword';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Reset" component={ForgotPasswordScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={BufferScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="Post" component={CreatePostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
