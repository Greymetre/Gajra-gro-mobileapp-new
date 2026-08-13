import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import React from 'react';
import Header from '../comman/Header/Header';
import colors from '../../styles/colors';
import {Text} from '@rneui/base';
import navigationStrings from '../../constants/navigationStrings';
import {Card, Header as HeaderRNE} from '@rneui/themed';
import imagePath from '../../constants/imagePath';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const Paytm = (props: any) => {
  const navigation = useNavigation();
  // const renderIconImage = ({item}) => {
  //   return (
  //     <View>
  //       <Image source={item.image} />
  //     </View>
  //   );
  // };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header
        onPress={navigation.goBack}
        backArrow={imagePath.BACK}
        title={'Redemption'}
      />
      <View>
        <Text>Select your UPI apps</Text>
        <FlatList
          numColumns={2}
          data={null}
          renderItem={({item}) => (
            <Card containerStyle={styles.upi_cards}>
              <TouchableOpacity style={{}}>
                <View style={styles.row}>
                  <Text style={styles.text_text}>{item.title}</Text>
                  <Image source={item.image} style={styles.other_upi} />
                </View>
              </TouchableOpacity>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Paytm;
