import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SecondSplashScreen from '../screen/SecondSplashScreen';
import OnBoarding from '../screen/OnBoarding';
import {Screen} from 'react-native-screens';
import SplashScreen from '../screen/SplashScreen';
import SignUp from '../screen/Authentication/SignUp';
import SignIn from '../screen/Authentication/SignIn';
import VerifyOtp from '../screen/Authentication/VerifyOtp';
import Complateprofile from '../screen/Complateprofile';
import Welcome from '../screen/Welcome';
import ProfilePicture from '../screen/ProfilePicture';
import BankAccountDetails from '../screen/BankAccountDetails';
import DrivingDetails from '../screen/DrivingDetails';
import GovernmentID from '../screen/GovernmentID';
import FindingJob from '../screen/FindingJob';
import EnableLocationAccess from '../screen/EnableLocationAccess';
import BottomTab from './BottomTab';
import YourProfile from '../screen/YourProfile/YourProfile';
import UpdateDoc from '../screen/YourProfile/UpdateDoc';
import HelpCenter from '../screen/HelpCenter/HelpCenter';
import CancelRide from '../screen/Booking/CancelRide';
import Cars from '../screen/Cars/Cars';
import ForgotPassword from '../screen/Authentication/ForgotPassword';
import AddNewCar from '../screen/Cars/AddNewCar';
import CarDocument from '../screen/Cars/CarDocument';
import UploadCarPUC from '../screen/Cars/UploadCarPUC';
import UploadCarInsurance from '../screen/Cars/UploadCarInsurance';
import UploadCarCertificate from '../screen/Cars/UploadCarCertificate';
import UploadCarPermit from '../screen/Cars/UploadCarPermit';
import CarImage from '../screen/Cars/CarImage';
import Pre_BookedRide from '../screen/Pre_BookedRide';
import PrivacyPolicy from '../screen/PrivacyPolicy';
import PasswordManager from '../screen/Authentication/PasswordManager';
import Notification from '../screen/Notification';
import AskForOtp from '../screen/AskForOtp';
import CollectCash from '../screen/CollectCash';
import RateRider from '../screen/RateRider';
import AddVehicle from '../screen/AddVehicle';
import SelectTransport from '../screen/SelectTransport';
import TransportLists from '../screen/TransportLists';
import EditVehicleDetails from '../screen/EditVehicleDetails';
import OngoingRide from '../screen/Booking/OngoingRide';
import ChatScreen from '../screen/ChatScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SecondSplashScreen" component={SecondSplashScreen} />
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Complateprofile" component={Complateprofile} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="ProfilePicture" component={ProfilePicture} />
      <Stack.Screen name="BankAccountDetails" component={BankAccountDetails} />
      <Stack.Screen name="DrivingDetails" component={DrivingDetails} />
      <Stack.Screen name="GovernmentID" component={GovernmentID} />
      <Stack.Screen name="FindingJob" component={FindingJob} />
      <Stack.Screen name="SelectTransport" component={SelectTransport} />
      <Stack.Screen name="TransportLists" component={TransportLists} />
      <Stack.Screen name="EditVehicleDetails" component={EditVehicleDetails} />
      <Stack.Screen
        name="EnableLocationAccess"
        component={EnableLocationAccess}
      />
      <Stack.Screen name="YourProfile" component={YourProfile} />
      <Stack.Screen name="UpdateDoc" component={UpdateDoc} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} />
      <Stack.Screen name="CancelRide" component={CancelRide} />
      <Stack.Screen name="Cars" component={Cars} />
      <Stack.Screen name="AddNewCar" component={AddNewCar} />
      <Stack.Screen name="CarDocument" component={CarDocument} />
      <Stack.Screen name='UploadCarPUC' component={UploadCarPUC}/>
      <Stack.Screen name="UploadCarInsurance" component={UploadCarInsurance} />
      <Stack.Screen name="UploadCarCertificate" component={UploadCarCertificate} />
      <Stack.Screen name="UploadCarPermit" component={UploadCarPermit} />
      <Stack.Screen name='CarImage' component={CarImage}/>
      <Stack.Screen name='Pre_BookedRide' component={Pre_BookedRide}/>
      <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy}/>
      <Stack.Screen name='PasswordManager' component={PasswordManager}/>
      <Stack.Screen name='Notification' component={Notification}/>
      <Stack.Screen name='AskForOtp' component={AskForOtp}/>
      <Stack.Screen name='CollectCash' component={CollectCash}/>
      <Stack.Screen name='RateRider' component={RateRider}/>
      <Stack.Screen name='AddVehicle' component={AddVehicle}/>
      <Stack.Screen name='OngoingRide' component={OngoingRide}/>
      <Stack.Screen name='ChatScreen' component={ChatScreen}/>
    </Stack.Navigator>
  );
};

export default AppStack;
