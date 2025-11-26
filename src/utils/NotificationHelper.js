import { getMessaging, getToken, requestPermission } from '@react-native-firebase/messaging';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { setStorageData, getStorageData } from '../../framework/src/Utilities';
import { Platform, Linking, Alert } from 'react-native';
import { getApp } from '@react-native-firebase/app';

const ANDROID_VERSION_13 = 33;
const app = getApp();
const messaging = getMessaging(app);

export const getFCMToken = async () => {
  await messaging.registerDeviceForRemoteMessages();
  const tokenFCM = await getToken(messaging);
  return tokenFCM;
};

const openAppSettings = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Unable to open settings');
  });
};

export const checkAndRequestNotificationPermission = async () => {
  let permissionStatus = RESULTS.GRANTED;

  if (Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_13) {
    permissionStatus = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (permissionStatus !== RESULTS.GRANTED) {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      permissionStatus = result;
    }
  } else if (Platform.OS === 'ios') {
    const authStatus = await messaging().hasPermission();
    if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
      const requestStatus = await messaging().requestPermission();
      permissionStatus =
        requestStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        requestStatus === messaging.AuthorizationStatus.PROVISIONAL
          ? RESULTS.GRANTED
          : RESULTS.DENIED;
    } else if (
      authStatus === messaging.AuthorizationStatus.DENIED ||
      authStatus === messaging.AuthorizationStatus.BLOCKED
    ) {
      permissionStatus = RESULTS.DENIED;
    }
  }

  if (permissionStatus === RESULTS.GRANTED) {
    const token = await getFCMToken();
    return token;
  } else {
    Alert.alert(
      'Notifications Disabled',
      'Please enable notifications in settings to receive alerts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openAppSettings() },
      ]
    );
    return null;
  }
};
