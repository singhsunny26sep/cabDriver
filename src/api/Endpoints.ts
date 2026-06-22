export const SIGN_UP = {
    url: '/rider-signup',
    method: 'POST',
};
export const SIGN_IN = {
    url: '/rider-login',
    method: 'POST',
};
export const ADD_VEHICLE = {
    url: '/riderVehicle',
    method: 'POST',
};
export const UPDATE_VEHICLE = {
    url: '/riderVehicle/',
    method: 'PUT',
};
export const DELETE_VEHICLE = {
    url: '/riderVehicle/',
    method: 'DELETE',
};
export const UPDATE_VEHICLE_STATUS = {
    url: '/riderVehicle/select_Active_Vehicle/',
    method: 'PUT',
};
export const GET_PROFILE = {
    url: '/rider-profile',
    method: 'GET',
};
export const UPDATE_PROFILE = {
    url: '/rider-update-profile',
    method: 'PUT',
};
export const GET_RIDER_VEHICLES = {
    url: '/riderVehicle?type=',
    method: 'GET',
};
export const UPDATE_RIDE_BOOKING = {
    url: '/bookings/update/',
    method: 'PATCH',
};
export const UPDATE_RIDE_STATUS = {
    url: '/bookings/rideStatus/update/',
    method: 'PATCH',
};
export const GET_CHATS_DATA = {
  url: '/chat/',
  method: 'GET',
};
export const SENT_EMAIL_OTP_FORGOT_PASSWORD = {
  url: '/rider-verify-email_forgetPassword',
  method: 'POST',
};
export const VERIFY_EMAIL_OTP_FORGOT_PASSWORD = {
  url: '/rider-verify-email_otp_forgetPassword',
  method: 'POST',
};
export const CREATE_EMAIL_PASSWORD = {
  url: '/rider-verify-new_forgetPassword',
  method: 'POST',
};
export const CREATE_RATING = {
    url: '/client/rating/create',
    method: 'POST',
};
