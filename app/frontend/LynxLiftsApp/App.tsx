import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

import { setupNotificationHandlers } from './notificationService';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    setupNotificationHandlers();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" component={BufferScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Status" component={StatusScreen} />
          <Stack.Screen name="Post" component={CreatePostScreen} />
          <Stack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverFeed" component={DriverFeedScreen} />
          <Stack.Screen name="DriverAccount" component={DriverAccountScreen} />
          <Stack.Screen name="SetPreference" component={SetPreferenceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
