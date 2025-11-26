import React from 'react';
import AppStack from './AppStack';
// import NotificationPopup from '../components/CustomNotification/RIdeNotification';
import { useNotification } from '../utils/notificationHook';
import { useSelector } from 'react-redux';

const AppNavigator = () => {
  const {isPopupVisible, popupData, handleAcceptTheCall, handleCancel, toggleRidePoup, setPopupVisible} =
  useNotification();
  const userData = useSelector((state) => state.user);
  // console.log("user Dtaa of redux in app navigator....................", userData?.userData);
  // console.log("user Dtaa of redux in app navigator....................", userData?.userData?.isRidePopupVisible);

  return (
    <>
      <AppStack />
      {/* <NotificationPopup
          visible={userData?.userData?.isRidePopupVisible}
          // visible={true}
          data={popupData}
          onAccept={handleAcceptTheCall}
          onCancel={() => setPopupVisible(false)}
        /> */}
    </>
  );
};

export default AppNavigator;
