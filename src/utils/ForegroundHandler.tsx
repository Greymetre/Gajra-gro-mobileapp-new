import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react'
import PushNotification from "react-native-push-notification";

export const ForegroundHandler = ({ navigation }: any) => {
  console.log(navigation, 'oooo')
  PushNotification.createChannel(
    {
      channelId: 'fcm_fallback_notification_channel', // (required)
      channelName: 'My channel', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    created => console.log(`createChannel returned '${created}'`),
  );
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    
    const unSubscribeAction = PushNotification?.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        if (notification?.userInteraction) {
          navigation.navigate(notification?.data?.customKey)
        }
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.


      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
    PushNotification?.popInitialNotification((notification) => {
      console.log('Initial Notification', notification);
    });
    return () => {
      unSubscribeAction();
    };
  }, []);
  
  useEffect(() => {

    const unSubscribe = messaging().onMessage(async remoteMessage => {
      console.log("Recieved in foreground", remoteMessage);
      const [messageId, notification] = remoteMessage
      PushNotification.localNotification({
        channelId: 'fcm_fallback_notification_channel', // (required)
        channelName: 'My channel', // (required)
        messageId: messageId,
        title: notification.title,
        body: notification.body,
        soundName: "default",
        vibrate: true,
        playSound: true,
      })
    })
    return unSubscribe
  }, [])
  return null
};