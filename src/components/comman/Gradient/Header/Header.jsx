import { View, Text, Platform, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import {
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import imagePath from '../../../../constants/imagePath';

const Header = ({ source, title }) => {
    return (
        <View>
            <View
                style={{
                    width: '100%',
                    height: responsiveHeight(1),
                    justifyContent: 'center',
                }}>
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.8, y: 1 }}
                    colors={['#39B8FF', '#39B8FF', '#0029FF']}
                    style={styles.linearGradient}>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginHorizontal: responsiveWidth(5),
                        }}>
                        <TouchableOpacity>
                            <Image
                                style={{
                                    top:
                                        Platform.OS === 'ios'
                                            ? responsiveHeight(11)
                                            : responsiveHeight(6),
                                    tintColor: 'white',
                                    width: 20,
                                    height: 20,
                                }}
                                resizeMode="contain"
                                source={source}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.buttonText, { top: responsiveHeight(2) }]}>
                            {title}
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
};

export default Header;
