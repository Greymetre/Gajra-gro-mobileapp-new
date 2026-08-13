// import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux';
// import {ApplicationState} from '../redux';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
export var token = '';

// UI Code Merged

// export const setLoginAuthToken = (data: string) => {
//   try {
//     // localStorage.setItem("authToken", JSON.stringify(data));
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getAuthToken = async () => {
//   try {
//     // const token = await localStorage.getItem("authToken");
//     const token = '';
//     return token;
//   } catch (error) {
//     console.log(error);
//   }
// };
export async function getSetToken() {
  const stateData = useSelector(
    (state: ApplicationState) => state.loginReducers,
  );
  var authData = JSON.parse(stateData);
  const token = authData.token;
  // const token = await getAuthToken();
  // console.log(token);
  setLoginAuthToken(token);
  // return token;
}

export const setLoginAuthToken = (data: string) => {
  token = data;
};
// Old Method
export const getAuthToken = () => {
  // const stateData = useSelector(
  //   (state: ApplicationState) => state.loginReducers,
  // );
  // var authData = JSON.parse(stateData);
  // const token = authData.token;
  // const token = await getAuthToken();
  console.log(token);
  return token;
};

// export const getAuthToken = () => {
//   const stateData = useSelector(
//     (state: ApplicationState) => state.loginReducers,
//   );
//   var authToken = stateData.token;
//   return authToken
//   // return token;
// };

export const removeAuthToken = async () => {
  try {
    // return await localStorage.Remove("authToken", JSON.stringify(data));
    // return '';
    await AsyncStorage.setItem('TOKEN', '');
    console.log(AsyncStorage.getItem('TOKEN'));
    return AsyncStorage.setItem('TOKEN', '');

    // return await AsyncStorage.clear();
  } catch (error) {
    console.log(error);
  }
};

export const isUserLoggedIn = async (data: string) => {
  try {
    return (await getAuthToken()) !== null ? true : false;
  } catch (error) {
    console.log(error);
  }
};

export const setTokenAsyncStorage = async (data: string) => {
  try {
    return await AsyncStorage.setItem('TOKEN', data);
  } catch (error) {
    console.log(error);
  }
};

export const getTokenAsyncStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('TOKEN');
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
};

export const setSettingAsyncStorage = async (data: object) => {
  try {
    return await AsyncStorage.setItem('SETTING', JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export const getSettingAsyncStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('SETTING');
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
};
