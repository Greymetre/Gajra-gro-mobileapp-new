//Auth Routes
// export const POST_AUTH_LOGIN = '/loyalty/auth/login';
export const POST_AUTH_LOGIN_OTP = '/loyalty/auth/loginWithOtp';
export const POST_AUTH_LOGIN_PASSWORD = '/loyalty/auth/login';
// Logout
export const POST_AUTH_LOGOUT = '/loyalty/auth/logout';
//User Info

export const GET_CUSTOMER_AUTH_INFO = '/loyalty/auth/getAuthInfo';
// Send Scanned Code
export const POST_SCANNED_CODE = '/loyalty/transactions/couponScans';
// Transaction History
export const GET_TRANSACTION_HISTORY = '/loyalty/transactions';

// Get Country List
export const GET_COUNTRY_LIST = '/address';

// Get List of States by Country
export const GET_STATE_LIST = '/address/getStates';
export const GET_CUSTOMERTYPE_LIST = '/loyalty/auth/setting';

// Get List of Cities by State
export const GET_CITY_LIST = '/address/getCities';

//
export const POST_SIGN_UP = '/loyalty/auth/signup';
export const POST_PROFILE_IMAGE_UPLOAD = '/loyalty/auth/profileImageUpload';
//
// export const GET_USER_COUNTRY = '/user/country';

//
// export const GET_USER_COUNTRY = '/user/country';

//
// export const GET_USER_COUNTRY = '/user/country';

//
// export const GET_USER_COUNTRY = '/user/country';

//User Routes
export const MODULE_USERS = '/users';

//User Routes
export const MODULE_TRANSACTION = '/loyalty/transactions';
export const DASHBOARD = '/loyalty/dashboard';
export const SEEN_WELCOME_MESSAGE = '/loyalty/dashboard/seenWelcomeMessage';
//Neft Redemptions
export const POST_NEFT_REDEMPTION = '/loyalty/redemption/neftRedemption';
export const POST_UPI_REDEMPTION = '/loyalty/redemption/upiRedemption';
export const GET_REDEMPTION_HISTORY = '/loyalty/redemption';
export const POST_WALLET_REDEMPTION = '/loyalty/redemption/paytmRedemption';
export const GET_CUSTOMER_BALANCEPOINT = '/loyalty/redemption/balancePoint';
//Get User Bank Info
export const GET_CUSTOMER_BANKINFO = '/loyalty/auth/getBankInfo';
export const POST_UPI_CUSTOMER_BANKINFO = '/loyalty/auth/updateUpiInfo';
//Update Customer Bank Info
export const UPDATE_CUSTOMER_BANKINFO = '/loyalty/auth/updatebankInfo';
export const UPDATE_CUSTOMER_PERSONALINFO = '/loyalty/auth/updatePersonalInfo';
export const UPDATE_CUSTOMER_KYCINFO = '/loyalty/auth/kycUpdate';
export const GET_CUSTOMER_KYCINFO = '/loyalty/auth/getKycInfo';
export const GET_CUSTOMER_ADDRESS = '/loyalty/auth/getAddress';
export const UPDATE_CUSTOMER_ADDRESS = '/loyalty/auth/updateAddress';
export const GET_BANNER_IMAGES = '/loyalty/setting/getBannerImages';
export const GET_LOYALTY_SETTING = '/loyalty/setting/getLoyaltySetting';
export const GET_CONTACT_SETTING = '/loyalty/setting/getContactSetting';
export const GET_SETTING = '/loyalty/setting';
export const GET_OTP = '/loyalty/auth/newOtpRequest';
export const TOKEN_POST = '/loyalty/dashboard/token';
export const RESEND_OTP = '/loyalty/auth/resendOtpRequest';
export const CREATE_NEW_PASSWORD = '/loyalty/auth/createNewPassword';
export const GET_MOBILE_EXISTS = '/loyalty/auth/mobileExists';
export const GET_LAST_REDEMPTION = '/loyalty/redemption/getLastRedemption';
export const GET_CUSTOMER_PROFILE_INFO = '/loyalty/auth/getCustomerInfo';
export const TRANSACTION_HISTORY_FILTER = '/loyalty/transactions';
export const REDEMPTION_HISTORY_FILTER = '/loyalty/redemption';
export const DAMAGE_COUPON_HISTORY = '/loyalty/transactions/invalidCoupon';
// ex
// export const GET_DIST_INFO = '/loyalty/';
