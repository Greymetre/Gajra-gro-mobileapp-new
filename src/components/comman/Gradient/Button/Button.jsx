import { View, Text, TextInput } from 'react-native';
import React from 'react';
import {
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import Colors from '../../../../styles/colors';
import colors from '../../../../styles/colors';

const Button = ({ title }) => {
    return (
        <View
            style={{
                marginHorizontal: responsiveWidth(5),
            }}>
            <View>
                <Text style={{ marginTop: responsiveHeight(2), color: colors.black }}>
                    {title}
                </Text>
                <TextInput
                    style={{
                        borderBottomColor: Colors.grey,
                        borderBottomWidth: 0.3,
                        marginTop: responsiveHeight(2),
                    }}
                />
            </View>
        </View>
    );
};

export default Button;
