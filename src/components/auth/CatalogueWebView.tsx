import {
    View,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Platform,
    StatusBar,
    BackHandler,
    PermissionsAndroid,
} from 'react-native';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
    Header as HeaderRNE,
} from '@rneui/themed';

import { useTranslation } from 'react-i18next';

import { WebView } from 'react-native-webview';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const CatalogueWebView = ({ navigation, route }: any) => {

    const webViewRef = useRef<any>(null);

    const [canGoBack, setCanGoBack] = useState(false);
    const { isFocused }: any = useIsFocused()

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({
                headerTitle: route?.params?.title || 'Catalogue',
            });
        }, [navigation, route])
    );

    // The locator pages call navigator.geolocation for "Nearby Search".
    // On Android the WebView only gets a fix once the app itself holds the
    // runtime location permission, so ask for it before the page needs it.
    useEffect(() => {

        if (Platform.OS !== 'android') {
            return;
        }

        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]).catch(() => { });

    }, []);

    const backAction = () => {

        // If webview has history -> go back in webview
        if (canGoBack && webViewRef.current) {
            webViewRef.current.goBack();
            return true;
        }

        // Otherwise go back to RN screen
        navigation.goBack();
        return true;
    };

    // HANDLE HARDWARE BACK
    useEffect(() => {



        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();

    }, [canGoBack]);



    const handleShouldStartLoadWithRequest = (request: any) => {
        const url = request.url;

        if (url.includes('tel:')) {
            Linking.openURL(url);
            return false;
        }

        if (url.startsWith('whatsapp:')) {
            Linking.openURL(url);
            return false;
        }

        if (url.startsWith('mailto:')) {
            Linking.openURL(url);
            return false;
        }

        return true;
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'white' }]}
            edges={['bottom']}
        >
            {
                isFocused && (
                    <StatusBar
                        barStyle={'dark-content'}
                        backgroundColor={'transparent'}
                    />
                )
            }


            <HeaderRNE
                backgroundColor="white"
                backgroundImageStyle={{}}
                barStyle="default"
                centerComponent={{
                    text: route?.params?.title || 'Catalogue',
                    style: { color: 'black', fontSize: 16 },
                }}
                centerContainerStyle={{ height: 28, justifyContent: 'center', }}
                leftComponent={
                    <TouchableOpacity style={{}} onPress={() => backAction()}>
                        <Ionicons name="chevron-back" size={25} color={'black'} />
                    </TouchableOpacity>
                }
                leftContainerStyle={{ paddingLeft: 5 }}
                placement="center"
                containerStyle={[Platform.OS === 'ios' && { backgroundColor: 'white', height: 55, justifyContent: 'center', top: -30 }, !route?.params?.title && { height: 30, justifyContent: 'center', top: -20 }]}

            />

            <WebView
                ref={webViewRef}

                source={{
                    uri: route?.params?.url || "https://gajra.greyninja.in/"
                }}

                javaScriptEnabled
                domStorageEnabled

                // Required for navigator.geolocation inside the WebView (Android)
                geolocationEnabled

                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                allowsFullscreenVideo

                mixedContentMode="always"

                onShouldStartLoadWithRequest={
                    handleShouldStartLoadWithRequest
                }

                // IMPORTANT
                onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);
                }}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default CatalogueWebView;