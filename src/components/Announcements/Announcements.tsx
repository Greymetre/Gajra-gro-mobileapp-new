import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../bottomtabs/history/styles';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../styles/colors';
import {Card, Header as HeaderRNE} from '@rneui/themed';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {requestGetAllRedemptions} from '../../services/backend_helper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Announcements = (props: any) => {
  const [redemptionData, setRedemptionData] = useState([]);
  const {height, width} = Dimensions.get('window');
  const fetchRedemptions = async () => {
    await requestGetAllRedemptions()
      .then(res => {
        if (res.isError == false) {
          setRedemptionData(res.data);
        }
      })
      .catch(error => {
        console.log('Response Redemptions: ', error);
      });
  };
  useEffect(() => {
    fetchRedemptions();
  }, []);

  const _renderItem = (props: any) => {
    const {item} = props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomColor: colors.grey,
          borderBottomWidth: 0.5,
          alignItems: 'center',
          height: 170,
        }}>
        {/* <Image
          style={{width: 40, height: 40}}
          source={imagePath.NOTIFICATION_BELL}
        /> */}
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginHorizontal: responsiveWidth(2),
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                color: colors.black,
                // fontWeight: 300,
                fontSize: responsiveFontSize(1.7),
              }}>
              {item.giftName}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.6),
                  color: colors.grey,
                  flexWrap: 'wrap',
                  width: responsiveWidth(69),
                }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry galley.
              </Text>
              {/* <Text
                style={{
                  fontSize: responsiveFontSize(1.6),
                  color: colors.grey,
                }}></Text> */}
            </View>
            <Text>
              {new Date(item.createdAt).toLocaleDateString().slice(0, 10)}
            </Text>
          </View>
          <View>
            <View style={{alignItems: 'center'}}>
              {/* <Text
                style={{fontSize: responsiveFontSize(1.6), color: colors.grey}}>
                {item.date}
              </Text> */}
              {/* <Text>
                {new Date(item.createdAt).toLocaleDateString().slice(0, 10)}
              </Text> */}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View>
        <HeaderRNE
          backgroundColor={colors.white}
          backgroundImageStyle={{}}
          barStyle="default"
          centerComponent={{
            text: 'Announcements',
            style: {color: 'black', fontSize: 19},
          }}
          centerContainerStyle={{height: 28, justifyContent: 'center'}}
          leftComponent={
            <TouchableOpacity
              containerStyle={{padding: 5}}
              onPress={() => props.navigation.goBack()}>
              <Ionicons name="chevron-back" size={25} color={'black'} />
            </TouchableOpacity>
          }
          placement="center"
        />
        {/* <View
          style={{
            alignItems: 'center',
            // backgroundColor: colors.lightblue,
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
              <Text style={{textDecorationColor: 'black'}}>
                You Redeemed till now
              </Text>
              <Text style={{color: '#399DFF', fontSize: 33, fontWeight: '600'}}>
                {' '}
                INR 4,300
              </Text>
            </View>
          </Card>
            </View> */}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View
            style={{
              marginHorizontal: responsiveWidth(4),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* <Text style={{paddingTop: 20, paddingBottom: 10}}>History</Text> */}
          </View>

          <View
            style={{
              marginHorizontal: responsiveWidth(6),
              overflow: 'hidden',
            }}>
            <FlatList data={redemptionData} renderItem={_renderItem} />
          </View>
        </View>
        <View style={{paddingBottom: responsiveScreenHeight(6)}}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Announcements;
