import {post, get, submitFormData, newsubmitFormData, API_URL} from './api_helper';
import * as url from './url_helper';

/*========== Auth Module ===============*/
// Login Method
export const requestLoginOTP = (data: any) =>
  post(url.POST_AUTH_LOGIN_OTP, data);
export const requestLoginPassword = (data: any) =>
  post(url.POST_AUTH_LOGIN_PASSWORD, data);
export const requestSignup = (data: any) => post(url.POST_SIGN_UP, data);
export const requestProfileImageUpload = (data: any) =>
  submitFormData(url.POST_PROFILE_IMAGE_UPLOAD, data, 'POST');

export const requestGetAuthCustomerInfo = (data: any) =>
  post(url.GET_CUSTOMER_AUTH_INFO, data);
// Logout

export const requestLogout = (data: any) => post(url.POST_AUTH_LOGOUT, data);
// Send Scanned Code to Server
// export const submitScannedCode = (data: any, config: any) =>
export const submitScannedCode = (data: any) =>
  post(url.POST_SCANNED_CODE, data);
// {
// try {
// } catch (error) {
//   console.log(error);
// }
// return post(url.POST_SCANNED_CODE, data).then(res => res.json());
// };

// Get Transaction History
export const requestGetTransactionHistory = () =>
  get(url.GET_TRANSACTION_HISTORY);
// Get Countries List
export const requestGetCountryList = () => get(url.GET_COUNTRY_LIST);
// Get List of States by Country
export const requestGetStateList = (data: any) =>
  post(url.GET_STATE_LIST, data);
export const requestGetCustomerTypeList = () =>
  get(url.GET_CUSTOMERTYPE_LIST);
// Get List of Cities by State
export const requestGetCityList = (data: any) => post(url.GET_CITY_LIST, data);
// Get all Users
export const requestGetAllUsers = () => get(url.MODULE_USERS, {});
// Get all Transactions
export const requestGetAllTransactions = () => get(url.MODULE_TRANSACTION, {});
// Get Customer Bank Info
export const requestGetCustomerBankInfo = (data: any) =>
  post(url.GET_CUSTOMER_BANKINFO, data);
export const postUpdateUpiInfo = (data: any) =>
  post(url.POST_UPI_CUSTOMER_BANKINFO, data);
export const requestUpdateCustomerKycInfo = (data: any) =>
  submitFormData(url.UPDATE_CUSTOMER_KYCINFO, data, 'POST');
export const requestUpdateCustomerDetail = (data: any) =>
  submitFormData(url.UPDATE_CUSTOMER_PERSONALINFO, data, 'POST');
export const requestUpdateCustomerLocation = (data: any) =>
  post(url.UPDATE_CUSTOMER_ADDRESS, data);
// Get Customer Bank Info
export const requestNeftRedemption = (data: any) =>
  post(url.POST_NEFT_REDEMPTION, data);
export const requestUpiRedemption = (data: any) =>
  post(url.POST_UPI_REDEMPTION, data);
export const requestWalletRedemption = (data: any) =>
  post(url.POST_WALLET_REDEMPTION, data);
export const requestGetAllRedemptions = () => get(url.GET_REDEMPTION_HISTORY);
export const requestCustomerBalancePoint = (data: any) =>
  post(url.GET_CUSTOMER_BALANCEPOINT, data);
export const requestGetCustomerAddress = (data: any) =>
  post(url.GET_CUSTOMER_ADDRESS, data);
export const requestUpdateCustomerAddress = (data: any) =>
  post(url.UPDATE_CUSTOMER_ADDRESS, data);
export const requestGetBannerImages = (data: any) =>
  post(url.GET_BANNER_IMAGES, data);
export const requestGetKycInfo = (data: any) =>
  post(url.GET_CUSTOMER_KYCINFO, data);
// export const requestDistributorInfo = (data:any) =>get(url.)
export const requestGetLoyaltySetting = (data: any) =>
  post(url.GET_LOYALTY_SETTING, data);
export const requestGetContactSetting = (data: any) =>
  post(url.GET_CONTACT_SETTING, data);

// Get App Setting
export const requestGetSettingInfo = () => get(url.GET_SETTING);
export const requestGetProfileInfo = (data: any) =>
  post(url.GET_CUSTOMER_PROFILE_INFO, data);
export const requestDashboard = () => get(url.DASHBOARD);
`  `;
export const requestSendOTP = (data: any) => post(url.GET_OTP, data);
export const tokenSend = (data: any) => post(url.TOKEN_POST, data);
export const requestResendOTP = (data: any) => post(url.RESEND_OTP, data);
export const requestCreateNewPassword = (data: any) =>
  post(url.CREATE_NEW_PASSWORD, data);
export const requestGetMobileExist = (data: any) =>
  post(url.GET_MOBILE_EXISTS, data);
export const requestSeenWelcomeMessage = (data: any) =>
  post(url.SEEN_WELCOME_MESSAGE, data);
export const postupdatebankinfo = (data: any) =>
  post(url.UPDATE_CUSTOMER_BANKINFO, data);
export const getLastRedemptionInfo = (data: any) =>
  post(url.GET_LAST_REDEMPTION, data);


export const requestFilterTransaction = async (data: any) => {
  return await fetch(`${API_URL}${url.TRANSACTION_HISTORY_FILTER}?startDate=${data?.startDate}&endDate=${data?.endDate}`, {
    method: "GET",
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': `Bearer ${data?.token}`
    },
  }).then(res => res.json())
    .then(async (resData) => {
      return resData
    })
};

export const requestDamageHistory = async (data: any) => {
  let bodyData : any
  if(data?.startDate && data?.endDate){
    bodyData = {
      startDate : data?.startDate,
      endDate: data?.endDate
    }
  }else{
    bodyData = {}
  }
  return await fetch(`${API_URL}${url.DAMAGE_COUPON_HISTORY}`, {
    method: "POST",
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': `Bearer ${data?.token}`
    },
    body: new URLSearchParams(bodyData).toString(),
  }).then(res => res.json())
    .then(async (resData) => {
      return resData
    })
};

export const requestPostalCode = async (data: any) => {
  let tokenData= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vdG9yZnJlbnp5NUB3ZWIuZGUiLCJhY2NvdW50TmFtZSI6IkFydHVyX0FydHVyIiwiaWQiOiI3MjI1NTMwODIwIiwiZmlyZWJhc2VJZCI6IkNlSnBpNHFUeTRYUW5yTGh4cjlwZ1BpZUx3ajIiLCJsb2dpbldpdGhPdGhlciI6MTAsInVzZXJUeXBlIjoyODUsImxhbmd1YWdlIjoiZGUiLCJwb2xpY2llcyI6eyJpc1Rlcm1zVmVyc2lvbiI6dHJ1ZSwiaXNDb29raWVWZXJzaW9uIjp0cnVlLCJpc1ByaXZhY3lWZXJzaW9uIjp0cnVlfSwiaWF0IjoxNzI4NTY1NzE0fQ.oNENMRoOEy3R48GmKPkYYUOFJNVapD7S8N4xDSrIXho'
  return await fetch(`https://nominatim.openstreetmap.org/search?q=${data?.search},india&format=json`, {
    method: "GET",
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
      'Authorization': `${tokenData}`
    },
  }).then(res => res.json())
    .then(async (resData) => {
      return resData
    })
};

export const requestFilterRedemption = async (data: any) => {
  console.log(data)
  return await fetch(`${API_URL}${url.REDEMPTION_HISTORY_FILTER}?startDate=${data?.startDate}&endDate=${data?.endDate}`, {
    method: "GET",
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': `Bearer ${data?.token}`
    },
  }).then(res => res.json())
    .then(async (resData) => {
      return resData
    })
};
