import React, {useState, useEffect} from 'react';
import {requestGetStateList} from '../../../services/backend_helper';
import {Dropdown} from 'react-native-element-dropdown';
import {pickerListProps} from './dropdownTheme';
import {Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

const {height, width} = Dimensions.get('window');

const StateDropDown = (props: any) => {
  const {t} = useTranslation();

  const {handleInputChange, country, statename} = props;
  const [stateData, setStateData] = useState([]);
  const fetchStateData = async () => {
    await requestGetStateList({country: country}).then(res => {
      if (!res.isError) {
        setStateData(res.data);
      }
    });
  };
  useEffect(() => {
    fetchStateData();
  }, [country]);

  return (
    <Dropdown
      data={stateData}
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
      //

      //
      selectedTextProps={{selectionColor: 'black'}}
      search
      {...pickerListProps({selectedValue: statename, searchPlaceholder: 'Search state', icon: 'map-outline'})}
      labelField="label"
      valueField="value"
      placeholder={`${t('select')} ${t('state')}`}
      searchPlaceholder="Search..."
      value={statename}
      onChange={(item: any) => {
        handleInputChange('address.state', item.value);
      }}
    />
  );
};

export default StateDropDown;
