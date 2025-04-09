import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

const requestPermissions = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
  } 
  
  else {
    console.log('Notification permission denied');
  }
};

// Function to handle foreground notifications (when app is open)
const handleForegroundNotifications = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground Notification:', remoteMessage);
    Alert.alert('New Notification', remoteMessage.notification.title);
  });
};

// Function to handle background notifications (when app is in the background)
const handleBackgroundNotifications = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background Notification:', remoteMessage);
  });
};

// Function to handle notifications when the app is opened from a terminated state
const handleNotificationOpen = () => {
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open:', remoteMessage);
      }
    });
};

export const setupNotificationHandlers = () => {
  requestPermissions();
  handleForegroundNotifications();
  handleBackgroundNotifications();
  handleNotificationOpen();
};