import {
    View,
    Text,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import Header from '../comman/Header/Header';
import imagePath from '../../constants/imagePath';
import colors from '../../styles/colors';
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveWidth,
} from 'react-native-responsive-dimensions';
import DashedLine from 'react-native-dashed-line';

const ReferEarn = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <Header backArrow={imagePath.BACK} title="Refer & Earn" />
            <View
                style={{
                    justifyContent: 'center',
                    marginHorizontal: responsiveWidth(6),
                }}>
                <Image
                    source={imagePath.REFER_FRIEND}
                    style={{
                        width: responsiveWidth(60),
                        height: responsiveHeight(30),
                        alignSelf: 'center',
                        marginTop: responsiveHeight(4),
                    }}
                />
                <Text
                    style={{
                        fontSize: responsiveFontSize(2),
                        color: colors.black,
                        fontWeight: 'bold',
                        marginTop: responsiveHeight(3),
                    }}>
                    Share Link
                </Text>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: responsiveHeight(5.5),
                        borderWidth: 1,
                        marginTop: responsiveHeight(0.5),
                        borderRadius: responsiveWidth(3),
                        borderColor: colors.borderColor,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text
                            style={{
                                fontSize: responsiveFontSize(2),
                                color: colors.grey,
                                fontWeight: '400',
                                marginStart: responsiveWidth(2),
                            }}>
                            Your Referral Code
                        </Text>
                        <Text
                            style={{
                                fontSize: responsiveFontSize(2),
                                color: colors.grey,
                                fontWeight: '400',
                                marginStart: responsiveWidth(13),
                            }}>
                            VIV123ASD
                        </Text>
                        <Image
                            source={imagePath.COPY}
                            style={{ width: 20, height: 20, marginStart: responsiveWidth(4) }}
                        />
                    </View>
                    <TextInput style={{ marginStart: responsiveWidth(2) }} />
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: responsiveHeight(4) }}>
                <DashedLine dashGap={7} dashLength={1} dashThickness={1} />
            </View>
        </SafeAreaView>
    );
};

export default ReferEarn;
