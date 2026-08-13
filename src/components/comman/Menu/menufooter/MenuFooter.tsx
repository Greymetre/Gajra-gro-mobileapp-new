import { View, Text } from 'react-native';
import React from 'react';
import {
    responsiveFontSize,
    responsiveWidth,
} from 'react-native-responsive-dimensions';

const MenuFooter = ({ title }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: responsiveWidth(3),
                margin: responsiveWidth(3),
            }}>
            <Text style={{ fontSize: responsiveFontSize(1.6), color: '#909090' }}>
                {title}
            </Text>
        </View>
    );
};

export default MenuFooter;
