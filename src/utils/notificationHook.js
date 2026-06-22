// hooks/notification.hook.ts
import {useEffect, useRef, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import Sound from 'react-native-sound';
import axios from 'axios';
import {BASE_URL} from '../../Api/Url';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {showToast} from '../components/CustomToast/CustomToast';
import {setUserData} from '../redux/slice/UserSlice';

export const useNotification = () => {
  const navigation = useNavigation();
  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [userToken, setUserToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userLocalData, setUserLocalData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupData, setPopupDatas] = useState(null);
  const [callTimeout, setCallTimeout] = useState(null);

  const ringtoneRef = useRef(null);

  useEffect(() => {
    loadLocalData();

    // 1️⃣ Foreground Notification
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);
      //   handleIncomingCall(remoteMessage);
    });

    // 2️⃣ Background Notification
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('Background Notification Clicked:', remoteMessage);
        // handleIncomingCall(remoteMessage);
      },
    );

    // 3️⃣ Killed App Notification (Cold Start)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Killed App Notification:', remoteMessage);
          //   handleIncomingCall(remoteMessage);
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);

  const loadLocalData = async () => {
    const userLData = await loadUserLocalMethod();
    // showToast('error', 'Image Error', 'Failed to select image');
    console.log('user Local data from Notification hook ---', userLData);
    setUserLocalData(userLData);
    setUserToken(userLData.token);
    setUserId(userLData._id);
  };

  //   const handleIncomingCall = (remoteMessage: any) => {
  //     console.log(
  //       '👋 hello response got from remote message --->>>>',
  //       remoteMessage?.data,
  //     );
  //     if (remoteMessage?.data) {
  //       const {
  //         callType,
  //         callerName,
  //         roomId,
  //         uid,
  //         type,
  //         receiverId,
  //         sessionId,
  //         age,
  //         callerRole,
  //         channelName,
  //         distance,
  //         image,
  //         role,
  //         token,
  //       } = remoteMessage.data;
  //       const parsedToken = JSON.parse(token);

  //       const remoteData = {
  //         callType,
  //         callerName,
  //         roomId,
  //         uid,
  //         receiverId,
  //         type,
  //         sessionId,
  //         age,
  //         callerRole,
  //         channelName,
  //         distance,
  //         image,
  //         role,
  //         token: parsedToken.token,
  //       };

  //     dispatch(setPopupData(remoteData))
  //     setPopupDatas(remoteData);

  //       // if (type === 'call_ended') {
  //       //   console.log('----->>>>call should be end');
  //       //   setIsPopupVisible(false);
  //       //   stopRingtone();
  //       // }

  //       // Show incoming call poupup and play ringtone
  //       if (roomId && type === 'call_invitation') {
  //         setIsPopupVisible(true);
  //         playRingtone(); // 🎵 Play ringtone when call arrives

  //         // Start a 30-second timer
  //         const timeoutId = setTimeout(() => {
  //           console.log('🚨 Call timeout reached, ending call...');
  //           stopRingtone();
  //           setIsPopupVisible(false);
  //         }, 30000);

  //         setCallTimeout(timeoutId);
  //       }
  //       console.log(
  //         '----->>>>userData?.popupData?.sessionId',
  //         userData?.popupData,
  //       );
  //     }
  //   };
  // console.log('👋poup data --->', popupData);

  const playRingtone = () => {
    stopRingtone();
    const ringtonePath =
      Platform.OS === 'ios' ? 'ringtone.mp3' : 'ringtone.mp3';
    const newRingtone = new Sound(ringtonePath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load ringtone', error);
        return;
      }
      newRingtone.setNumberOfLoops(-1);
      newRingtone.play();
      ringtoneRef.current = newRingtone;
    });
  };
  const stopRingtone = () => {
    console.log('11ringing is closing....');
    if (ringtoneRef.current) {
      ringtoneRef.current.stop(() => {
        ringtoneRef.current?.release();
        ringtoneRef.current = null;
      });
    }
  };

  const handleAcceptTheCall = async () => {
    setIsPopupVisible(false);
    stopRingtone(); // 🔇 Stop ringtone on accept
    clearTimeout(callTimeout); // Clear timeout on accept
    setCallTimeout(null);
    // try {
    //   const response = await axios({
    //     url: `${BASE_URL}${ACCEPT_CALL.url}`,
    //     method: ACCEPT_CALL.method,
    //     data: {
    //       sessionId: popupData.sessionId,
    //       receiverId: popupData.receiverId,
    //       roomId: popupData.roomId,
    //     },
    //     headers: {
    //       Authorization: `Bearer ${userToken}`,
    //     },
    //   });
    //   console.log(
    //     '-----ACCEPT CALL API response token---->>>',
    //     response.data.data.token.token,
    //   );
    //   if (response.status === 200) {
    //     handleAccept(response.data.data.token.token);
    //     // navigateToVoice(response.data.data);
    //   }
    // } catch (error) {
    //   console.log('here call breaks....123', error.response);
    //   // handleError(error);
    // }
  };

  const handleAccept = tokenForRoom => {
    // if (!popupData || !popupData.type) {
    //   console.error('popupData is missing or undefined:', popupData);
    //   return;
    // }
    // navigation.navigate('VoiceCallScreen', {
    //   token: tokenForRoom,
    //   username: userLocalData?.firstName,
    //   userToken: userToken,
    //   sessionId: popupData.sessionId,
    //   recieverName: popupData.callerName,
    //   recieverAge: popupData.age,
    //   recieverDistance: popupData.distance,
    //   recieverImage: popupData.image,
    // });
  };

  const handleCancel = async () => {
    setIsPopupVisible(false);
    stopRingtone();
    clearTimeout(callTimeout); // Clear timeout on reject
    setCallTimeout(null);
    // try {
    //   const response = await axios({
    //     url: `${BASE_URL}${END_CALL.url}`,
    //     method: END_CALL.method,
    //     data: {
    //       sessionId: popupData.sessionId,
    //       duration: 0,
    //       rating: 1,
    //       feedback: 'Call Rejected',
    //     },
    //     headers: {
    //       Authorization: `Bearer ${userToken}`,
    //     },
    //   });
    //   if (response.status === 200) {
    //     console.log('-----END CALL API response token---->>>', response);
    //     setIsPopupVisible(false);
    //     // handleAccept(response.data.data.token.token);
    //     // navigateToVoice(response.data.data);
    //   }
    // } catch (error: any) {
    //   console.log('here call breaks....123', error.response);
    //   // handleError(error);
    // }
  };
  const toggleRidePoup = () => {
    dispatch(
      setUserData({
        ...userLocalData,
        isRidePopupVisible: !userData?.userData?.isRidePopupVisible,
      }),
    );
  };
  const setPopupVisible = (value) => {
    dispatch(
      setUserData({
        ...userLocalData,
        isRidePopupVisible: value,
      }),
    );
  };

  return {
    isPopupVisible,
    popupData,
    handleAcceptTheCall,
    handleCancel,
    userLocalData,
    userToken,
    playRingtone,
    stopRingtone,
    toggleRidePoup,
    setPopupVisible,
  };
};
