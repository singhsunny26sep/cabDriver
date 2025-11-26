import {Dimensions} from 'react-native';

//Device dimensions
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('screen');
export const deviceWidth = viewportWidth;
export const deviceHeight = viewportHeight;

export const GOOGLE_API_KEY = 'AIzaSyD7u-bDQzuzqgRxHkT9fRd6xyMsRmtgLEY';
export const GEOAPIFY_API_KEY = '48c3c945328c4bc9a0a4c3d428909bc5';
export const CLOUDINARY_PRESET = 'ml_default';
export const CLOUDINARY_CLOUD_NAME = 'dvyj5bjdu';
let sampleHeight = 800;
let sampleWidth = 360;

export const rideTypes = [
  {name: 'Car', value: 'car'},
  {name: 'Bike', value: 'bike'},
  {name: 'Taxi', value: 'taxi'},
  {name: 'Parcel', value: 'cycle'},
];

export const shadowStyle = {
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.5,
  shadowRadius: 4,
  elevation: 5,
};

export const GenderType = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
];

export const ComplainType = [
  {label: 'Vehicle not clean', value: 'vehicle not clean'},
  {label: 'Vehicle not clean', value: 'vehicle not clean'},
];
