import 'react-native-reanimated';
import React from 'react';
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
import DriverChatScreen from './screens/ChatScreen';

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
          <Stack.Screen name="Post" component={CreatePostScreen} />
          <Stack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverFeed" component={DriverFeedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverAccount" component={DriverAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SetPreference" component={SetPreferenceScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverChat" component={DriverChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PassengerChat" component={PassengerChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PassengerAccount" component={PassengerAccountScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
