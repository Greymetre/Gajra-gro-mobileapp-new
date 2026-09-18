import React, {useState, useEffect} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {pickerListProps} from './dropdownTheme';
import {requestGetCityList} from '../../../services/backend_helper';
import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
import {useTranslation} from 'react-i18next';

const CityDropDown = (props: any) => {
  const {t} = useTranslation();
  const {handleInputChange, statename, city} = props;
  const [cityData, setCityData] = useState([]);
  const fetchCityData = async () => {
    await requestGetCityList({state: statename}).then(res => {
      if (!res.isError) {
        setCityData(res.data);
      }
    });
  };
  // console.log(cityData);
  useEffect(() => {
    fetchCityData();
  }, [statename]);

  return (
    <Dropdown
      style={{
        width: width * 0.87,
        // width: width * 0.3,
        height: 50,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        borderRadius: 8,
        // borderBottomColor:
        // Optional override, e.g. to fit inside a card.
        ...(props.dropdownStyle || {}),
      }}
      selectedTextProps={{selectionColor: 'black'}}
      search
      data={cityData}
      {...pickerListProps({selectedValue: city, searchPlaceholder: 'Search city', icon: 'business-outline'})}
      labelField="label"
      valueField="value"
      placeholder={`${t('select')} ${t('city')}`}
      searchPlaceholder="Search City"
      value={city}
      onChange={(item: any) => {
        handleInputChange('address.city', item.value);
      }}
    />
  );
};

export default CityDropDown;
