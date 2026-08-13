import {View, Text, SafeAreaView} from 'react-native';
import React ,{ useEffect, useState} from 'react';
import { requestCustomerBalancePoint } from '../../services/backend_helper';

const AvailablePoints = () => {
    const [balancePoint, setBalancePoint] = useState(0);
    const fetchCustomerBalancePoint = async () => {
        await requestCustomerBalancePoint({})
          .then(res => {
            if (res.isError == false) {
              setBalancePoint(res?.data?.balance);
            }
          })
          .catch(error => {
            console.log('Response: ', error);
          });
      };
      useEffect(() => {
        fetchCustomerBalancePoint();
      }, []);
  return (<>{ balancePoint }</>);
};

export default AvailablePoints;
