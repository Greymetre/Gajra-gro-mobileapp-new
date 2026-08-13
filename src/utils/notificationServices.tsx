import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log(enabled, "ioodjfij")
    if (enabled) {
        console.log('Authorization status:', authStatus);
        await messaging().onTokenRefresh(async (newToken) => {
            // Handle the token refresh here
            console.log('FCM token refreshed:', newToken);
            await AsyncStorage.setItem('fcmToken', newToken)
            // You can update your server with the new token if necessary.
            // Example: send newToken to your server via an HTTP request.
        });

        // Clean up the listener when the component unmounts

        getToken()
    }
}


const getToken = async () => {


    try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log(fcmToken, 'New Token')
            await AsyncStorage.setItem('fcmToken', fcmToken)
        }
    } catch (error) {
        console.log(error, 'error raised in fxmToken')
    }

}

export const notificationListener = async (navigation: any) => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:', remoteMessage?.notification);
        if (remoteMessage) {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage?.notification,
            );
            navigation.navigate(remoteMessage?.data?.customKey)
        }
    });



    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                navigation.navigate(remoteMessage?.data?.customKey)
            }
        });
}
export const notificationListenerdummy = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:', remoteMessage?.notification);
    });



    messaging()
        .getInitialNotification()
        .then(remoteMessage => {

            console.log(
                'Notification caused app to open from quit state:',
                remoteMessage.notification,
            );

        });
}