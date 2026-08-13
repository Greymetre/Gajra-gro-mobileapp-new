import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import imagePath from '../../utils/imagePath';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const DropDown = ({
  label,
  data = [],
  value = {},
  onSelect = undefined => {},
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const onSelectedItem = val => {
    setShowOptions(false);
    onSelect(val);
  };
  return (
    <View style={{marginTop: responsiveHeight(2)}}>
      <Text style={{marginBottom: responsiveHeight(1.5)}}>{label}</Text>
      <TouchableOpacity
        onPress={() => {
          setShowOptions(!showOptions);
        }}
        activeOpacity={0.8}
        style={styles.dropDownStyle}
      >
        <Text>{!!value ? value?.name : `Select`}</Text>

        <Image
          source={imagePath.DROP_DOWN}
          resizeMode={'contain'}
          style={{
            width: 15,
            height: 15,
            transform: [{rotate: showOptions ? '180deg' : '0deg'}],
          }}
        />
      </TouchableOpacity>
      {showOptions && (
        <ScrollView>
          {data.map((val, i) => {
            return (
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderBottomRadius: 20,
                }}
                onPress={() => onSelectedItem(val)}
                key={String(i)}
              >
                <Text
                  style={{
                    padding: 10,
                    borderColor: '#B4B4B4',
                    borderWidth: 1,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  }}
                >
                  {val.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  dropDownStyle: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    minHeight: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderTopColor: '#B4B4B4',
  },
});
export default DropDown;
