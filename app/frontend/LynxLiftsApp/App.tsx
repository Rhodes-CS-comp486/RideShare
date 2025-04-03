import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/RegisterScreen';
import BufferScreen from './screens/BufferScreen';
import FeedScreen from './screens/FeedScreen';
import StatusScreen from './screens/StatusScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DriverFeedScreen from './screens/DriverFeedScreen';
import DriverAccountScreen from './screens/DriverAccountScreen';
import SetPreferenceScreen from './screens/SetPreferenceScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={BufferScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="Post" component={CreatePostScreen} />
        <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
        <Stack.Screen name="DriverFeed" component={DriverFeedScreen} />
        <Stack.Screen name="DriverAccount" component={DriverAccountScreen} />
        <Stack.Screen name="SetPreference" component={SetPreferenceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
