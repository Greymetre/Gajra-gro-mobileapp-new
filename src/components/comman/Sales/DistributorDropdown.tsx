import React, {useState, useEffect} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {requestGetCityList} from '../../../services/backend_helper';
const DistributorDropdown = (props: any) => {
  const {handleInputChange, name} = props;
  const [distName, setdistName] = useState([]);
  const fetchCityData = async () => {
    await requestGetCityList({state: statename}).then(res => {
      if (!res.isError) {
        setCityData(res.data);
      }
    });
  };
  useEffect(() => {
    fetchCityData();
  }, [statename]);

  return (
    <Dropdown
      style={{
        height: 40,
        paddingHorizontal: 5,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
      }}
      selectedTextStyle={{color: 'black'}}
      selectedTextProps={{selectionColor: 'black'}}
      itemTextStyle={{paddingLeft: 10}}
      statusBarIsTranslucent={true}
      inputSearchStyle={{
        height: 40,
        // fontSize: 16,
      }}
      showsVerticalScrollIndicator={true}
      search
      data={cityData}
      labelField="label"
      valueField="value"
      placeholder={'Select City'}
      searchPlaceholder="Search City"
      value={city}
      onChange={(item: any) => {
        handleInputChange('city', item.value);
      }}
    />
  );
};

export default DistributorDropdown;
