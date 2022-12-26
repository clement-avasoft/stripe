import React, {useEffect} from 'react';
import {Alert, Button, View} from 'react-native';

import {useApplePay, useGooglePay} from '@stripe/stripe-react-native';

import {createPaymentIntent} from '../services/stripe/payment_intent.service';

const CustomStripeWidgetScreen: React.FC = () => {
  const {isGooglePaySupported, initGooglePay, presentGooglePay} =
    useGooglePay();
  const {isApplePaySupported, presentApplePay, confirmApplePayPayment} =
    useApplePay();

  useEffect(() => {
    checkGooglePaySupport();
  }, []);

  const checkGooglePaySupport = async () => {
    if (!(await isGooglePaySupported({testEnv: true}))) {
      return;
    }

    initializeGooglePay();
  };

  const applePaySupport = async () => {
    if (!isApplePaySupported) {
      return;
    }

    await initializeApplePay();
  };

  const initializeGooglePay = async () => {
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

  const initializeApplePay = async () => {
    const {error} = await presentApplePay({
      cartItems: [
        {label: 'Example item name', amount: '14.00', paymentType: 'Immediate'},
      ],
      country: 'US',
      currency: 'USD',
      shippingMethods: [
        {
          amount: '20.00',
          identifier: 'DPS',
          label: 'Courier',
          detail: 'Delivery',
        },
      ],
      requiredShippingAddressFields: ['emailAddress', 'phoneNumber'],
      requiredBillingContactFields: ['phoneNumber', 'name'],
    });

    if (error) {
      Alert.alert(error.code, error.message);
      return;
    }

    await doApplePay();
  };

  const doGooglePay = async () => {
    const paymentIntent: any = await createPaymentIntent(
      '14',
      'cus_N1pdOTHYFbsxxI',
      'Test',
    );

    const {error} = await presentGooglePay({
      clientSecret: paymentIntent.client_secret,
      forSetupIntent: false,
    });

    if (error) {
      return Alert.alert(error.code, error.message);
    }

    Alert.alert('Success', 'The payment was confirmed successfully.');
  };

  const doApplePay = async () => {
    const paymentIntent: any = await createPaymentIntent(
      '2000',
      'cus_N1pdOTHYFbsxxI',
      'Test',
    );

    const {error: confirmError} = await confirmApplePayPayment(
      paymentIntent.client_secret,
    );

    if (confirmError) {
      Alert.alert(confirmError.code, confirmError.message);
    }

    Alert.alert('Success', 'The payment was confirmed successfully.');
  };

  return (
    <View>
      <Button onPress={doGooglePay} title="Google Pay" />
      {isApplePaySupported ? (
        <Button onPress={applePaySupport} title="Apple Pay" />
      ) : null}
    </View>
  );
};

export default CustomStripeWidgetScreen;
