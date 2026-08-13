import {View, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Text} from '@rneui/base';
import navigationStrings from '../../constants/navigationStrings';
import {Header as HeaderRNE} from '@rneui/themed';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../styles/colors';
import LottieView from 'lottie-react-native';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RewardSuccess = (props: any) => {
  const route = useRoute();
  const {pts} = route.params;
  const navigation = useNavigation<NavigationInterFace>();
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: colors.white, flexShrink: 1}}>
      <HeaderRNE
        backgroundColor="white"
        backgroundImageStyle={{}}
        barStyle="default"
        centerComponent={{
          text: 'Redemption',
          style: {color: 'black', fontSize: 19},
        }}
        centerContainerStyle={{height: 28, justifyContent: 'center'}}
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationStrings.HOME)}>
            <Ionicons name="chevron-back" size={25} color={'black'} />
          </TouchableOpacity>
        }
        leftContainerStyle={{paddingLeft: 5}}
        placement="center"
      />
      <View
        style={{
          flex: 0.5,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <LottieView
            style={{
              paddingTop: 10,
              height: 240,
              width: 240,
            }}
            source={require('../../../assets/images/reward.json')}
            autoPlay
            loop
            speed={0.5}
          />
        </View>
        <View
          style={{
            width: '90%',
            marginTop: responsiveHeight(2),
            marginHorizontal: responsiveWidth(4),
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Redemption Request Sent :{/* {'After'} */}
            {pts}
            {'\n'}
          </Text>

          <Text
            style={{
              fontSize: 17,
            }}>
            Your points redemption request has
          </Text>
          <Text
            style={{
              fontSize: 17,
            }}>
            been sent successfully.
          </Text>
          <Text>{'\n'} Txn Id: 235902</Text>
          <Text>12:00 PM, 12 Feb 2023</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default RewardSuccess;
