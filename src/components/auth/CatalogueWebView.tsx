import {
    View,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Platform,
    StatusBar,
    BackHandler,
    PermissionsAndroid,
    ActivityIndicator,
    Image,
    Text,
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

import appTheme from '../../utils/appTheme';

const CatalogueWebView = ({ navigation, route }: any) => {

    const webViewRef = useRef<any>(null);

    const [canGoBack, setCanGoBack] = useState(false);
    // Cover the blank WebView with a loader until the first page has painted.
    const [isLoading, setIsLoading] = useState(true);
    // Shown instead of a blank white page when the site fails to load.
    const [hasError, setHasError] = useState(false);
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

            <View style={styles.container}>
            <WebView
                ref={webViewRef}

                source={{
                    uri: route?.params?.url || "https://gajragrolandingwebsite-production.up.railway.app/"
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

                onLoadStart={() => setHasError(false)}
                onLoadEnd={() => setIsLoading(false)}
                onError={() => setHasError(true)}
                onHttpError={() => setHasError(true)}
                // iOS kills the web content process under memory pressure, leaving a white page
                onContentProcessDidTerminate={() => webViewRef.current?.reload()}
            />

            {hasError && (
                <View style={styles.loader}>
                    <Ionicons name="cloud-offline-outline" size={48} color={'gray'} />
                    <Text style={styles.errorText}>Unable to load the page</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setHasError(false);
                            setIsLoading(true);
                            webViewRef.current?.reload();
                        }}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {isLoading && (
                <View style={styles.loader}>
                    <Image
                        source={require('../../../assets/images/logo.png')}
                        style={styles.loaderLogo}
                        resizeMode="contain"
                    />
                    <ActivityIndicator size="large" color={appTheme.NEW_PALLET} />
                </View>
            )}
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderLogo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    errorText: {
        marginTop: 12,
        fontSize: 15,
        color: 'black',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: appTheme.NEW_PALLET,
    },
    retryText: {
        color: 'white',
        fontSize: 15,
    },
});

export default CatalogueWebView;