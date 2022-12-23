import React, {useEffect} from 'react';
import {Alert, Button, View} from 'react-native';

import {useGooglePay} from '@stripe/stripe-react-native';

import {createPaymentIntent} from '../services/stripe/payment_intent.service';

const CustomStripeWidgetScreen: React.FC = () => {
  let {isGooglePaySupported, initGooglePay, presentGooglePay} = useGooglePay();

  useEffect(() => {
    checkGooglePaySupport();
  }, []);

  const checkGooglePaySupport = async () => {
    if (!(await isGooglePaySupported({testEnv: true}))) {
      Alert.alert('Google Pay is not supported.');
      return;
    }
    const {error} = await initGooglePay({
      testEnv: true,
      merchantName: 'Avasoft, Inc.',
      countryCode: 'US',
      billingAddressConfig: {
        format: 'FULL',
        isPhoneNumberRequired: true,
        isRequired: false,
      },
      existingPaymentMethodRequired: false,
      isEmailRequired: true,
    });

    if (error) {
      Alert.alert(error.code, error.message);
      return;
    }
  };

  const doPay = async () => {
    const paymentIntent: any = await createPaymentIntent(
      '2000',
      'cus_N1pdOTHYFbsxxI',
      'Test',
    );

    console.log('paymentIntent', paymentIntent);

    const {error} = await presentGooglePay({
      clientSecret: paymentIntent.client_secret,
      forSetupIntent: false,
    });

    if (error) {
      return Alert.alert(error.code, error.message);
    }

    Alert.alert('Success', 'The payment was confirmed successfully.');
  };

  return (
    <View>
      <Button onPress={doPay} title="Google Pay" />
    </View>
  );
};

export default CustomStripeWidgetScreen;
