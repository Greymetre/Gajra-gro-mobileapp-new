import React, {useState, useEffect} from 'react';
import {requestGetCountryList} from '../../../services/backend_helper';
import {Dropdown} from 'react-native-element-dropdown';
import {StyleSheet, Text, View} from 'react-native';

import {TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import '../../../../i18n/i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LanguageDropdown = (props: any) => {
  const {t, i18n} = useTranslation();
  // const selectedLngCode = i18n.language;
  const [value, setValue] = useState(null);
  const [def, setDef] = useState({label: 'English', value: 'en'});
  const [isFocus, setIsFocus] = useState(false);

  const langs = [
    {label: 'English', value: 'en'},
    {label: 'हिंदी', value: 'hi'},
    {label: 'বাংলা', value: 'bn'},
    {label: 'தமிழ்', value: 'ta'},
  ];
  // variant="pill": compact rounded look used in the dashboard header.
  const pill = props.variant === 'pill';
  return (
    // <View style={styles.container}>
    <Dropdown
      data={langs}
      style={
        pill
          ? {
              height: 36,
              width: 108,
              paddingHorizontal: 10,
              backgroundColor: '#F4F4F4',
              borderRadius: 18,
            }
          : {
              height: 40,
              width: 100,
              padding: 5,
              // maxHeight: 40,
              backgroundColor: 'white',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 8,
            }
      }
      renderLeftIcon={
        pill
          ? () => (
              <Ionicons name="language-outline" size={16} color="#373435" style={{marginRight: 4}} />
            )
          : undefined
      }
      iconStyle={pill ? {width: 16, height: 16} : undefined}
      selectedTextStyle={pill ? {fontWeight: '600', fontSize: 13, color: '#373435'} : {fontWeight: '500'}}
      // itemTextStyle={{margin: 0, padding: 0, fontSize: 10}}
      selectedTextProps={{selectionColor: 'black'}}
      labelField="label"
      valueField="value"
      // itemContainerStyle={{borderRadius: 8, height: 40}}
      containerStyle={{borderRadius: 8, paddingVertical: 0}}
      // containerStyle={{height: 50}}
      // itemContainerStyle={{height: 40}}
      searchPlaceholder="Search..."
      value={i18n.language}
      onChange={item => {
        setDef(item);
        i18n.changeLanguage(item.value);
        setIsFocus(false);
      }}
    />
    // </View>
  );
};

export default LanguageDropdown;

// const styles = StyleSheet.create({
// container: {
//   backgroundColor: 'white',
//   padding: 16,
// },
//   dropdown: {
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//   },
//   icon: {
//     marginRight: 5,
//   },
//   label: {
//     position: 'absolute',
//     backgroundColor: 'white',
//     left: 22,
//     top: 8,
//     zIndex: 999,
//     paddingHorizontal: 8,
//     fontSize: 14,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
// });
