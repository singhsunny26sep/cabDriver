import { useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import { COLORS } from '../theme/Colors';
import { showToast } from '../components/CustomToast/CustomToast';

const useRazorpayPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = async (options, onSuccess, onFailure) => {
    setIsProcessing(true);

    const paymentOptions = {
      description: options.description,
      image: options.image || 'https://your-logo-url.png',
      currency: options.currency || 'INR',
      key: options.key || 'rzp_test_cEnvzyHa9o3Izi', // Default test key
      amount: String(Number(options.amount) * 100), // Convert to paise
      name: options.name || 'Cab App',
      prefill: {
        email: options.prefill?.email || 'user@example.com',
        contact: options.prefill?.contact || '9876543210',
        name: options.prefill?.name || 'User Name',
      },
      theme: { color: COLORS.themePrimary},
    };

    try {
      const data = await RazorpayCheckout.open(paymentOptions);
      console.log(`Payment Success: ${JSON.stringify(data)}`);

      if (onSuccess) {
        onSuccess(data);
      }

      setIsProcessing(false);
      return { success: true, data };
    } catch (error) {
      console.log('Payment Error:', error);
      let errorMessage = 'Payment failed';

      if (error.code === 0) {
        errorMessage = 'Payment cancelled by user';
      } else if (error.code === 1) {
        errorMessage = 'Network error occurred';
      } else if (error.description) {
        errorMessage = error.description;
      }

      // Using custom toast instead of gluestack toast
      showToast('error', 'Error', errorMessage);

      if (onFailure) {
        onFailure(error);
      }

      setIsProcessing(false);
      return { success: false, error };
    }
  };

  return { initiatePayment, isProcessing };
};

export default useRazorpayPayment;
