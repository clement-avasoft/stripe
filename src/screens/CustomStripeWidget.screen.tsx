import React, {useEffect, useState} from 'react';
import {Alert, Button, Text, TextInput, View} from 'react-native';

import {
  useApplePay,
  useGooglePay,
  useStripe,
} from '@stripe/stripe-react-native';

import DefaultPadding from '../components/DefaultPadding.component';
import Header from '../components/Header.component';
import {createPaymentIntent} from '../services/stripe/payment_intent.service';

const CustomStripeWidgetScreen: React.FC = () => {
  const {isGooglePaySupported, initGooglePay, presentGooglePay} =
    useGooglePay();
  const {isApplePaySupported, presentApplePay, confirmApplePayPayment} =
    useApplePay();
  const {confirmPayment} = useStripe();
  const [cardNumber, setCardNumber] = useState<string>();
  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<string>();
  const [cvv, setCVV] = useState<string>();

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

  const doPay = () => {};

  return (
    <View style={{flex: 1}}>
      <Header value={'Stripe Native Elements'} />
      <DefaultPadding style={{marginTop: 75}}>
        <TextInput
          style={{
            height: 40,
            width: '100%',
            borderRadius: 8,
            padding: 10,
            backgroundColor: '#F5F5F5',
            marginBottom: 30,
          }}
          placeholder="Enter Card Number"
          onChangeText={(text: string) => {
            setCardNumber(text);
          }}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TextInput
            style={{
              height: 40,
              width: '45%',
              borderRadius: 8,
              padding: 10,
              backgroundColor: '#F5F5F5',
              marginBottom: 30,
            }}
            placeholder="Month"
            onChangeText={(text: string) => {
              setMonth(text);
            }}
          />
          <TextInput
            style={{
              height: 40,
              width: '45%',
              borderRadius: 8,
              padding: 10,
              backgroundColor: '#F5F5F5',
              marginBottom: 30,
            }}
            placeholder="Year"
            onChangeText={(text: string) => {
              setYear(text);
            }}
          />
        </View>
        <View style={{width: '100%'}}></View>
        <TextInput
          style={{
            height: 40,
            width: '100%',
            borderRadius: 8,
            padding: 10,
            backgroundColor: '#F5F5F5',
            marginBottom: 30,
          }}
          placeholder="CVV"
          onChangeText={(text: string) => {
            setCVV(text);
          }}
        />
        <Button onPress={doPay} title="Pay" />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          <Text>or</Text>
        </View>
        <Button onPress={doGooglePay} title="Google Pay" />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          <Text>or</Text>
        </View>
        <Button onPress={doApplePay} title="Apple Pay" />
      </DefaultPadding>
    </View>
  );
};

export default CustomStripeWidgetScreen;
