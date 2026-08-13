import NetInfo from '@react-native-community/netinfo';
import {useState} from 'react';
const OfflineNotice = () => {
  const [internet, setInternet] = useState<boolean>(false);
  function intAvail() {
    NetInfo.addEventListener(state => {
      if (state.isConnected === true) {
        // console.log('Connection type', state.type);
        // console.log('Is connected?', state.isConnected);
        // console.log('Internet Reachable?', state.isInternetReachable);
        // console.log('Detils?', state.details);
        setInternet(state.isConnected);

        // return tempInternet;
      } else if (state.isConnected === false) {
        // console.log('Connection type', state.type);
        // console.log('Is connected?', state.isConnected);
        // console.log('Internet Reachable?', state.isInternetReachable);
        // console.log('Detils?', state.details);
        setInternet(state.isConnected);
        // return tempInternet;
      }
      console.log(internet);
      //   return intAvail();
    });
  }
  return intAvail();
};
export default OfflineNotice;
