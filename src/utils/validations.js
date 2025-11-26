import {showToast} from '../components/CustomToast/CustomToast';

// Check if string is null, undefined, or blank
export const isStringNullBlank = (str, fieldName) => {
  if (str === null || str === undefined || str.trim() === '') {
    const message = `${fieldName} should not be empty!`
    showToast('error', 'Validation Error', message);
    return true;
  }
  return false;
};

// Validate email format
export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast(
      'error',
      'Validation Error',
      'Please enter a valid email address!',
    );
    return false;
  }
  return true;
};

// Validate password strength
export const isValidPassword = password => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

  if (password.length < 8) {
    showToast(
      'error',
      'Validation Error',
      'Password must be at least 8 characters!',
    );
    return false;
  }

  if (!passwordRegex.test(password)) {
    showToast(
      'error',
      'Validation Error',
      'Password must contain at least: 1 uppercase letter, 1 lowercase letter, and 1 special character.',
    );
    return false;
  }

  return true;
};


// Validate password match
export const doPasswordsMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    showToast('error', 'Validation Error', 'Passwords do not match!');
    return false;
  }
  return true;
};

export const isValidNumeric = (
    input,
    fieldName,
    allowHyphen = true,
    minDigits = 6
  ) => {
    // 1. Check if empty/null (using existing helper)
    if (isStringNullBlank(input)) return false;
  
    // 2. Check for invalid characters
    const charRegex = allowHyphen ? /^[0-9-]+$/ : /^[0-9]+$/;
    if (!charRegex.test(input)) {
      showToast(
        'error',
        'Validation Error',
        `${fieldName} can only contain ${allowHyphen ? 'numbers and hyphens' : 'numbers'}!`
      );
      return false;
    }
  
    // 3. Check hyphen rules (if allowed)
    if (allowHyphen) {
      if (input.startsWith('-') || input.endsWith('-') || input.includes('--')) {
        showToast('error', 'Validation Error', `${fieldName} cannot start/end with hyphens or have consecutive hyphens!`);
        return false;
      }
    }
  
    // 4. Check minimum digits by counting NON-hyphen characters
    const digitCount = input.replace(/-/g, '').length;
    if (digitCount < minDigits) {
      showToast(
        'error',
        'Validation Error',
        `${fieldName} must have at least ${minDigits} digits!`
      );
      return false;
    }
  
    return true; // All validations passed
  };

  // Validate Indian Driving License Number format
export const isValidLicense = (licenseNumber) => {
  // Indian DL format: 
  // - State code (2 letters)
  // - Year (2 digits, or 4 digits for newer ones)
  // - Unique alphanumeric sequence (up to 13 characters)
  const licenseRegex = /^[A-Z]{2}[0-9]{2}[0-9]{11}$|^[A-Z]{2}[0-9]{4}[0-9]{9}$/;
  
  if (!licenseRegex.test(licenseNumber)) {
    showToast(
      'error',
      'Validation Error',
      'Please enter a valid Indian Driving License Number (e.g., "TN0520181234567" or "TN20181234567")'
    );
    return false;
  }
  return true;
};

// Validate Indian Vehicle Registration Number (RC) format
export const isValidRCNumber = (rcNumber) => {
  // Indian RC format examples:
  // Old: TN 01 AB 1234
  // New: TN 01 AB CD 1234
  // BH series: 22 BH 2345 AB
  const rcRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$|^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[A-Z]{1,2}[0-9]{4}$|^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/i;
  
  // Remove all whitespace for validation
  const cleanedRC = rcNumber.replace(/\s/g, '').toUpperCase();
  
  if (!rcRegex.test(cleanedRC)) {
    showToast(
      'error',
      'Validation Error',
      'Please enter a valid Indian Vehicle Registration Number (e.g., "TN01AB1234", "TN01ABCD1234", or "22BH2345AB")'
    );
    return false;
  }
  return true;
};