import 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
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
import PassengerAccountScreen from './screens/PassengerAccountScreen';
import PassengerChatScreen from './screens/PassengerChatScreen';
import DriverChatScreen from './screens/DriverChatScreen';
import BrowseDrivers from './screens/BrowseDrivers';
import ConversationListScreen from './screens/ConversationListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" component={BufferScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Status" component={StatusScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Post" component={CreatePostScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverFeed" component={DriverFeedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverAccount" component={DriverAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SetPreference" component={SetPreferenceScreen} options={{ headerShown: false }} />
          {/* <Stack.Screen name="ConversationList" component={ConversationListScreen} options={{headerShown: false}}/> */}
          <Stack.Screen name="DriverChat" component={DriverChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PassengerChat" component={PassengerChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PassengerAccount" component={PassengerAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Browse" component={BrowseDrivers} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
