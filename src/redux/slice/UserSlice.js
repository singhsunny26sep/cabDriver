import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state with null userData
const initialState = {
  userData: null, // Start with null instead of empty object
  loading: false,
  error: null,
};

// Define your complete user data shape for reference
const userDataShape = {
  id: null,
  name: null,
  email: null,
  contact: null,
  token: null,
  fcmToken: null,
  lat: null,
  long: null,
  profileImage: null,
  city: null,
  country: null,
  state: null,
  pincode: null,
  gender: null,
  locality: null,
  isLoggedIn: null,
  isSignupCompleted: null,
  isRidePopupVisible: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Initialize or completely replace user data
    setUserData: (state, action) => {
      state.userData = {
        ...userDataShape, // Use the shape template
        ...action.payload, // Merge with incoming data
      };
      state.loading = false;
      state.error = null;
    },

    // Update specific user fields
    updateUserData: (state, action) => {
      if (!state.userData) {
        // Initialize if null
        state.userData = {
          ...userDataShape,
          ...action.payload,
        };
      } else {
        // Merge updates
        state.userData = {
          ...state.userData,
          ...action.payload,
        };
      }
    },

    // Clear all user data (logout)
    clearUserData: state => {
      state.userData = null;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Action creators
export const {
  setUserData,
  updateUserData,
  clearUserData,
  setLoading,
  setError,
} = userSlice.actions;

// Selectors with null checks
export const selectUserData = state => state.user.userData;
export const selectUserField = field => state =>
  state.user.userData ? state.user.userData[field] : null;
export const selectLoading = state => state.user.loading;
export const selectError = state => state.user.error;

// Async methods
export const saveUserLocalMethod = async userData => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const loadUserLocalMethod = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

export const removeUserLocalMethod = async () => {
  try {
    await AsyncStorage.removeItem('userData');
    return true;
  } catch (error) {
    console.error('Error removing user data:', error);
    return false;
  }
};

export default userSlice.reducer;
