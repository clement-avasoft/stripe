import {useStripe} from '@stripe/stripe-react-native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Alert, Button, View} from 'react-native';

interface StripeWidgetProps {
  route: any;
}

const StripeWidget: React.FC<StripeWidgetProps> = ({route}) => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {customerId, ephemeralSecret, clientSecret} = route.params;

  const initializePaymentSheet = async () => {
    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Avasoft, Inc.',
      customerId: customerId,
      customerEphemeralKeySecret: ephemeralSecret,
      paymentIntentClientSecret: clientSecret,
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: true,
      },
    });

    if (!error) {
      Alert.alert('Payment Failed');
    }

    const paymentResponse = await presentPaymentSheet();
    console.log(paymentResponse);
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  // const openPayment = async () => {
  //   const {error, paymentOption} = await presentPaymentSheet();
  //   console.log(error);
  //   console.log(paymentOption);
  // };

  return (
    <View>
      {/* <Button
        onPress={openPayment}
        title="Checkout"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      /> */}
    </View>
  );
};

export default StripeWidget;
