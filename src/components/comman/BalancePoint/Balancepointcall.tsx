import {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {requestCustomerBalancePoint} from '../../../services/backend_helper';

const Balancepointcall = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [balancePoint, setBalancePoint] = useState(0);
  console.log('Component lOad');

  const fetchCustomerBalancePoint = async () => {
    await requestCustomerBalancePoint({})
      .then(res => {
        console.log(res);
        if (res.isError == false) {
          setIsLoading(false);
          console.log('Points', res.data.balance);
          setBalancePoint(res.data.balance);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  // console;
  useEffect(() => {
    fetchCustomerBalancePoint();
    console.log('Use Effect Run');
  },[]);
  return <Text>{balancePoint}</Text>;
};

export default Balancepointcall;
