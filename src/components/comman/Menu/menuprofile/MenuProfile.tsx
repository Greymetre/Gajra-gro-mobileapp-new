import {View, Text, Image} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {MenuProfileInterdaces} from './MenuProfileInterfaces';
import imagePath from '../../../../constants/imagePath';
// const MenuProfile = ({source, name, mobile, membership, icMembership}) => {
const MenuProfile = ({
  source,
  name,
  mobile,
}: {
  source: any;
  name: any;
  mobile: any;
}) => {
  return (
    <View style={{marginTop: responsiveHeight(2)}}>
      <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
        {source ? (
          <Image
            style={{
              marginStart: responsiveWidth(5),
              height: 40,
              width: 40,
              borderRadius: 60,
            }}
            source={{uri: imagePath.IMAGE_URL + source}}
          />
        ) : (
          <Image
            source={imagePath.USER}
            style={{marginStart: responsiveWidth(5)}}
          />
        )}

        {/* <Image source={source} style={{marginStart: responsiveWidth(5)}} /> */}
        <View
          style={{
            marginStart: responsiveWidth(4),
            marginTop: responsiveHeight(0.5),
            backgroundColor: 'white',
          }}>
          <Text style={{fontWeight: 'bold'}}>{name}</Text>
          <Text style={{fontWeight: '500', color: '#B9B9B9'}}>{mobile}</Text>
        </View>
        {/* <view style={{flexDirection: 'row', marginTop: responsiveHeight(0.5)}}> */}
        {/* <Image
            style={{width: 14, height: 14}}
            source={icMembership}
            style={{marginStart: responsiveWidth(4)}}
          />

          <Text
            style={{
              fontWeight: '500',
              color: '#FFB000',
              marginStart: responsiveWidth(1.5),
            }}>
            {membership}
          </Text>
        </View> */}
      </View>
    </View>
  );
};

export default MenuProfile;
