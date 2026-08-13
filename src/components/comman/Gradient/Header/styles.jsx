import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';

const { StyleSheet, Platform } = require('react-native');

const styles = StyleSheet.create({
    buttonText: {
        fontSize: responsiveFontSize(2),
        alignItems: 'center',
        color: '#fff',
        fontWeight: '500',
        justifyContent: 'center',
        marginTop:
            Platform.OS === 'ios' ? responsiveHeight(9) : responsiveHeight(4),
        height: responsiveHeight(6),
        marginStart: responsiveWidth(4),
        backgroundColor: 'transparent',
    },
});
export default styles;
