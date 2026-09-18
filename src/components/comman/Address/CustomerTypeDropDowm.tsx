import React, {useState, useEffect} from 'react';
import {requestGetCustomerTypeList} from '../../../services/backend_helper';
import {Dropdown} from 'react-native-element-dropdown';
import {pickerListProps} from './dropdownTheme';
import {Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

const {height, width} = Dimensions.get('window');

const CustomerTypeDropDowm = (props: any) => {
  const {t} = useTranslation();

  const {handleInputChange, statename} = props;
  const [customerTypeData, setCustomerTypeData] = useState([]);

  // Fetch customer type data from the API
  const fetchCustomerTypeData = async () => {
    await requestGetCustomerTypeList().then(res => {
      if (!res.isError && res.data?.customerType) {
        // Format customerType data as needed by Dropdown
        const formattedData = res.data.customerType.map(type => ({
          label: type,   // If customer type is a simple string
          value: type    // Use the same value for both label and value fields
        }));
        setCustomerTypeData(formattedData);
      } else {
        console.log('Error fetching customer type data');
      }
    });
  };

  // UseEffect to fetch the data when the component mounts
  useEffect(() => {
    console.log( 'odododidodidoidodido')
    fetchCustomerTypeData();   
  }, []); // Removed customerTypeData from the dependency array

  return (
    <Dropdown
      data={customerTypeData}
      style={{
        width: width * 0.87,
        height: 50,
        // paddingHorizontal: 5,
        backgroundColor: 'white',
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        // Optional override, e.g. to fit inside a card.
        ...(props.dropdownStyle || {}),
      }}
      selectedTextProps={{selectionColor: 'black',}}
      {...pickerListProps({selectedValue: statename, icon: 'pricetag-outline'})}
      labelField="label"
      valueField="value"
      placeholder={`${t('select')} ${t('customertype')}`}
      searchPlaceholder="Search..."
      value={statename}
      onChange={(item: any) => {
        console.log(item.value,'item.value')
        handleInputChange('customerType', item.value);
      }}
    />
  );
};

export default CustomerTypeDropDowm;
