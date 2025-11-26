import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Common location permission types for Android and iOS
const LOCATION_PERMISSIONS = {
  android: {
    foreground: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    background: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  },
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, // iOS will request always permission after when-in-use
};

// Check if location services are enabled on the device
export const checkDeviceLocationServices = async () => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      () => resolve(true),
      (error) => {
        if (error.code === error.PERMISSION_DENIED || error.code === error.SERVICE_DISABLED) {
          resolve(false);
        } else {
          resolve(true);
        }
      },
      { enableHighAccuracy: false, timeout: 500 }
    );
  });
};

// Open device location settings
export const openLocationSettings = () => {
  if (Platform.OS === 'android') {
    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(() => {
      Linking.openSettings();
    });
  } else {
    Linking.openURL('App-Prefs:Privacy&path=LOCATION');
  }
};

// Request appropriate location permissions
export const requestLocationPermissions = async () => {
  try {
    // First check if device location is enabled
    const isLocationEnabled = await checkDeviceLocationServices();
    if (!isLocationEnabled) {
      Alert.alert(
        'Location Services Disabled',
        'Please enable device location services to use this feature',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings},
        ]
      );
      return false;
    }

    // Handle permissions based on platform
    if (Platform.OS === 'android') {
      // Request foreground permission first
      const foregroundStatus = await request(LOCATION_PERMISSIONS.android.foreground);
      
      if (foregroundStatus !== RESULTS.GRANTED) {
        console.log('Foreground location permission denied');
        return false;
      }

      // Then request background permission
      const backgroundStatus = await request(LOCATION_PERMISSIONS.android.background);
      
      if (backgroundStatus !== RESULTS.GRANTED) {
        console.log('Background location permission denied - app will work with foreground only');
        // We still return true because we have foreground permission
      }

      return true;
    } else {
      // iOS - request when-in-use first
      const whenInUseStatus = await request(LOCATION_PERMISSIONS.ios);
      
      if (whenInUseStatus === RESULTS.GRANTED) {
        // Then request always permission
        const alwaysStatus = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        
        if (alwaysStatus !== RESULTS.GRANTED) {
          console.log('Always location permission denied - app will work with when-in-use only');
        }
        return true;
      } else if (whenInUseStatus === RESULTS.DENIED) {
        console.log('Location permission denied');
        return false;
      } else if (whenInUseStatus === RESULTS.BLOCKED) {
        // Permission was denied and cannot be requested again without opening settings
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions in settings to use this feature',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    }
  } catch (error) {
    console.warn('Error requesting location permissions:', error);
    return false;
  }
};

// Get location once with enhanced error handling
export const getCurrentLocationOnce = async () => {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      console.warn('Location permission not granted');
      return null;
    }

    const isLocationEnabled = await checkDeviceLocationServices();
    if (!isLocationEnabled) {
      Alert.alert(
        'Location Services Disabled',
        'Please enable device location services to get your current location',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings },
        ]
      );
      return null;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading || 0,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
          };
          resolve(coords);
        },
        error => {
          console.warn('Location error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            Alert.alert(
              'Location Permission Required',
              'Please enable location permissions in settings',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
          } else if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
            Alert.alert(
              'Location Unavailable',
              'Could not get your location. Please ensure location services are enabled and try again.'
            );
          }
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  } catch (error) {
    console.warn('Error in getCurrentLocationOnce:', error);
    return null;
  }
};

let watchId = null;

// Watch location continuously with comprehensive error handling
export const watchLocationContinuously = (onLocationChange, onError) => {
  return new Promise((resolve) => {
    // Clear any previous watcher
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
    }

    // Start watching with more frequent updates
    watchId = Geolocation.watchPosition(
      position => {
        // console.log('New location received at HELPERRRRRRRRR:', position.coords);
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading || 0,
          speed: position.coords.speed || 0,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          timestamp: position.timestamp,
        };
        onLocationChange(coords);
      },
      error => {
        console.warn('Watch position error:', error);
        if (onError) {
          onError(error);
        }
        
        // Automatically stop watching on permission errors
        if (error.code === error.PERMISSION_DENIED) {
          stopWatchingLocation();
        }
      },
      {
        enableHighAccuracy: true,
        // distanceFilter: Platform.OS === 'ios' ? 0 : 5,
        distanceFilter: 1,
        interval: 2000,
        fastestInterval: 3000,
        useSignificantChanges: false,
        showsBackgroundLocationIndicator: Platform.OS === 'ios',
        // timeout: 20000,
      }
    );

    console.log("Location watching started with ID:", watchId);
    resolve(true);
  });
};

export const stopWatchingLocation = () => {
  if (watchId !== null) {
    console.log("Stopping location watch with ID:", watchId);
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
};

// Check current permission status
export const checkLocationPermissionStatus = async () => {
  try {
    if (Platform.OS === 'android') {
      const foregroundStatus = await check(LOCATION_PERMISSIONS.android.foreground);
      const backgroundStatus = await check(LOCATION_PERMISSIONS.android.background);
      
      return {
        foreground: foregroundStatus,
        background: backgroundStatus,
      };
    } else {
      const status = await check(LOCATION_PERMISSIONS.ios);
      const alwaysStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      
      return {
        whenInUse: status,
        always: alwaysStatus,
      };
    }
  } catch (error) {
    console.warn('Error checking permission status:', error);
    return null;
  }
};