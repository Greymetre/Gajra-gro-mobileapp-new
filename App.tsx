/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { LogBox, Platform, StatusBar, StyleSheet, useColorScheme } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux';
import { PersistGate } from 'redux-persist/integration/react';
import Splash from './src/components/splash/Splash';

import './src/translations';
import moment from 'moment';
import { notificationListener, notificationListenerdummy, requestUserPermission } from './src/utils/notificationServices';
import { ForegroundHandler } from './src/utils/ForegroundHandler';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { PushNotification } from 'react-native-push-notification';
import { Router } from './src/navigation/Router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
const App = () => {
  const navigationRef = React.useRef(null)
  // const isDarkMode = useColorScheme() === 'dark';
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    requestUserPermission()
    // notificationListenerdummy()
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
      // 'A VirtualizedList contains a cell which itself contains',
      'new NativeEventEmitter',
      'Require cycle:',
      'Remote debugger',
    ]);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    // Configure the notification handler when the app is in the foreground
    PushNotification?.configure({
      onNotification: function (notification) {
        // Handle the notification data here, if needed
        // const navigation = useNavigation();
        console.log(notification, "odododfkasjdfjhhsadfkjasfddsfsh")
        // navigation.navigate(notification.data.screen); // Navigate to the specified screen
      },
      requestPermissions: Platform.OS === 'ios',
    });
  }, []);

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {/* <SafeAreaView style={styles.container} */}

        {/* > */}
        {/* <StatusBar barStyle={'dark-content'}
          backgroundColor={'transparent'} /> */}
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            {
              Loading == false && (
                <ForegroundHandler navigation={navigationRef.current} />
              )
            }
            {Loading === true ? <Splash /> : <Router />}
          </NavigationContainer>
        </PersistGate>
        {/* <StatusBar barStyle={"dark-content"} hidden/>
      <SafeAreaView>
      </SafeAreaView> */}
        {/* </SafeAreaView> */}
      </SafeAreaProvider>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
