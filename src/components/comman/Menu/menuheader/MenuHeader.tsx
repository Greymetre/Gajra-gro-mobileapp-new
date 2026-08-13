import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import imagePath from '../../../../constants/imagePath';
import {
    responsiveFontSize,
    responsiveWidth,
} from 'react-native-responsive-dimensions';

const MenuHeader = ({ title, source }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor:'white',
                flex: 1,
                alignItems: 'center',
                padding: responsiveWidth(3),
                marginLeft: responsiveWidth(3),
                fontWeight: 'bold',
            }}>
            <TouchableOpacity>
                <Image
                    source={source}
                    style={{ width: 14, height: 14 }}
                    resizeMode={'contain'}
                />
            </TouchableOpacity>
            <Text
                style={{
                    marginStart: responsiveWidth(37),
                    fontSize: responsiveFontSize(1.6),
                    fontWeight: 'bold',
                    color: 'black',
                }}>
                {title}
            </Text>
        </View>
    );
};

export default MenuHeader;
