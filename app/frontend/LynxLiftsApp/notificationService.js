import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_URL } from '@env'

const getAndStoreToken = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    if (token) {
      await AsyncStorage.setItem('fcmtoken', token);
      console.log('Stored FCM Token:', token);
    }
  } else {
    console.log('Notification permission denied');
  }
};

// Send token to backend once user is logged in
export const sendTokenToBackend = async (userId) => {
  const token = await AsyncStorage.getItem('fcmtoken');
  
  if (token) {
    try {
      const response = await fetch(`${API_URL}/api/token/save-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rhodesid: userId, fcmtoken: token }),
      });

      if (!response.ok) {
        // Log the error response status and text for debugging
        const errorText = await response.text();
        console.error('Error sending token to backend. Status:', response.status, errorText);
      } else {
        const data = await response.json();
        console.log('Token sent to backend:', data);
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }
};

// Function to handle foreground notifications (when app is open)
const handleForegroundNotifications = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground Notification:', remoteMessage);
    Alert.alert('New Notification', remoteMessage.notification.title);
    Alert.alert('Upcoming Ride!', remoteMessage.notification.body);
  });
};


// Function to handle background notifications (when app is in the background)
const handleBackgroundNotifications = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background Notification:', remoteMessage);
    Alert.alert('New Notification', remoteMessage.notification.title);
  });
};

//Function to handle notifications when the app is opened from a terminated state
const handleNotificationOpen = () => {
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open:', remoteMessage);
      }
    });
};

//Auto-update token if it changes
const handleTokenRefresh = () => {
  messaging().onTokenRefresh(async (newToken) => {
    await AsyncStorage.setItem('fcmtoken', newToken);
    console.log('FCM token refreshed:', newToken);
    // Optional: If the user is logged in, re-send to backend
  });
};

export const setupNotificationHandlers = () => {
  getAndStoreToken();
  handleForegroundNotifications();
  handleBackgroundNotifications();
  handleNotificationOpen();
  handleTokenRefresh();
};