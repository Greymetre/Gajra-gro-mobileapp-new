import { Text } from '@rneui/base';
import { Button, Dimensions, Image, TouchableOpacity, View, Pressable } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Header as HeaderRNE } from '@rneui/themed';
import colors from '../../styles/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const RedemptionDetail = (props: any) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.white,
        // flex: 1,
        // flexDirection: 'column',
      }}>
      <HeaderRNE
       backgroundColor="white"
       backgroundImageStyle={{}}
       barStyle="dark-content"
        centerComponent={{
          text: 'Redemption Tracking',
          style: {color: '#000'},
        }}
        centerContainerStyle={{}}
        containerStyle={{width: 350}}
        leftContainerStyle={{}}
        linearGradientProps={{}}
        placement="center"
        rightContainerStyle={{}}
        statusBarProps={{}}
      />
      {/* <KeyboardAwareScrollView> */}
      {/* <View> */}

      {/* <HeaderRNE
          backgroundColor="white"
          barStyle="default"
          centerComponent={{
            text: 'Redemption Tracking',
            style: {color: 'black', fontSize: 19},
          }}
          containerStyle={{height: 1}}
          centerContainerStyle={{justifyContent: 'center'}}
          leftComponent={
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image
                source={imagePath.BACK}
                style={{
                  width: responsiveHeight(2),
                  height: responsiveHeight(2),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          }
          placement="center"
        />
      </View> */}
      {/* <View>
        <Text
        style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.lightblue,
          }}>
          <Card
            containerStyle={{
              backgroundColor: colors.lightblue,
              width: width,
              height: 110,
              borderBottomLeftRadius: responsiveWidth(3),
              borderBottomRightRadius: responsiveWidth(3),
              borderWidth: 0,
            }}>
            <View
              style={{
                paddingTop: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ textDecorationColor: 'black' }}>
                Your Balance
              </Text>
              <Text style={{ color: '#399DFF', fontSize: 32, fontWeight: '600' }}> INR 4,300</Text>
            </View>
          </Card>
        </View>
        <View style={{
          flexDirection: 'row',
          paddingTop: 10,
          paddingBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF'
        }}>
        Gift Page
        </Text>
      </View> */}
      {/* </KeyboardAwareScrollView> */}
      <View>
        <Text>Tseting text</Text>
      </View>
    </SafeAreaView>
  );
};
export default RedemptionDetail;
