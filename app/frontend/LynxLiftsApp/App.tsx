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
import DriverChatScreen from './screens/ChatScreen';
import BrowseDrivers from './screens/BrowseDrivers';
import Report from './screens/RegisterScreen';
import ReportScreen from './screens/ReportScreen';
import ExlpainRide from './screens/ExplainRideScreen';
import PassengerExplainRideScreen from './screens/PassengerExplainRideScreen';

// import { setupNotificationHandlers } from './notificationService';

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     setupNotificationHandlers();
  //   }
  // }, [isLoggedIn]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
            initialParams={{ setIsLoggedIn }} // Pass setIsLoggedIn to LoginScreen as an initial param
          />
          <Stack.Screen name="Welcome" component={BufferScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Status" component={StatusScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Post" component={CreatePostScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverFeed" component={DriverFeedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverAccount" component={DriverAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SetPreference" component={SetPreferenceScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverChat" component={DriverChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PassengerChat" component={PassengerChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PassengerAccount" component={PassengerAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Browse" component={BrowseDrivers} options={{ headerShown: false }} />
          <Stack.Screen name="Report" component={ReportScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ExplainRide" component={ExlpainRide} />
          <Stack.Screen name="PassengerExplainRide" component={PassengerExplainRideScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
