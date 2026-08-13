import axios from 'axios';
// import {useSelector} from 'react-redux';
import {
  // getAuthToken,
  // setLoginAuthToken,
  getTokenAsyncStorage,
} from './auth_helper';
// import {ApplicationState} from '../redux';
// Use this API in Production
// export const API_URL = 'http://43.204.27.204:4001/api'; //production  
// export const API_URL = 'https://apis.fieldkonnect.io/api'; //production
// export const API_URL = 'https://apis.fieldkonnect.io/api'; //live
// export const API_URL = 'https://apis.fieldkonnect.io/api'; //live

export const API_URL = 'https://apis.fieldkonnect.io/api'; //production
// export const API_URL = 'http://111.118.252.246:4001/api'; 

// Use this API in Testing
// export const API_URL = 'http://13.232.29.75:4000/api';

const axiosApi = axios.create({ baseURL: API_URL });

axiosApi.interceptors.request.use(async function (config: any) {
  // var authToken = stateData.token;
  // var authData = JSON.parse(stateData);
  // const token = authData.token;
  const token = await getTokenAsyncStorage();
  // config.headers.Authorization = `Bearer ${  .parse(token)}`;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);

// Add a 401 response interceptor
// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (401 === error.response.status) {
//     } else {
//       return Promise.reject(error);
//     }
//   },
// );
// export async function get(url: string, config = {}) {

export async function get(url: string, config = {}) {
  // const stateData = useSelector(
  //   (state: ApplicationState) => state.loginReducers,
  // );
  // var authData = JSON.parse(stateData);
  // var authToken = authData.token;
  // console.log(authToken);
  // setLoginAuthToken(authToken);
  // // const token = getAuthToken();
  // console.log(authToken);
  // // setLoginAuthToken(token);
  return await axiosApi.get(url, { ...config }).then(response => response.data);
}

export async function post(url: string, data: any, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function submitFormData(url: string, data: any, method: string) {
  const token = await getTokenAsyncStorage();
  return await axios({
    method: method,
    url: API_URL + url,
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data;',
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.data);
}
