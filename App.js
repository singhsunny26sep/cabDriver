import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store/ReduxStore';
import {PersistGate} from 'redux-persist/integration/react';
import CustomToast from './src/components/CustomToast/CustomToast';
import { checkNotificationPermission, createNotificationChannel, getFCMToken, requestNotificationPermission, showPermissionRationale } from './src/utils/notifications';
import { loadUserLocalMethod } from './src/redux/slice/UserSlice';
import socketServices from './src/utils/socketServices';
import crashlytics from '@react-native-firebase/crashlytics';


export default function App() {
  useEffect(() => {
    let socketInitialized = false;
    crashlytics().log('App started with crash analytics.......');
    
    const initApp = async () => {
      try {
        // Initialize notifications
        await initNotifications();
        
        // Initialize socket when we have a token
        const userData = await loadUserLocalMethod();
        
        if (userData?.token && !socketInitialized) {
          console.log("Initializing socket with user token");
          await socketServices.initializeSocket(userData.token);
          socketInitialized = true;
        }
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };

    const initNotifications = async () => {
      try {
        const hasPermission = await checkNotificationPermission();
        
        if (!hasPermission) {
          const granted = await requestNotificationPermission();
          if (!granted) {
            showPermissionRationale();
          } else {
            const token = await getFCMToken();
            console.log("FCM Token:", token);
          }
        } else {
          const token = await getFCMToken();
          console.log("FCM Token:", token);
        }
        
        await createNotificationChannel();
      } catch (error) {
        console.error('Notification initialization error:', error);
      }
    };

    initApp();

    return () => {
      // Clean up when app closes
      if (socketInitialized) {
        socketServices.disconnectSocket();
      }
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <AppNavigator />
          <CustomToast />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}