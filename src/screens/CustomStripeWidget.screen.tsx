import React, {useEffect} from 'react';

import {useGooglePay, useStripe} from '@stripe/stripe-react-native';
import {Alert, Button, View} from 'react-native';

import {createPaymentIntent} from '../services/stripe/payment_intent.service';

const CustomStripeWidgetScreen = () => {
  const {isGooglePaySupported, initGooglePay, presentGooglePay} =
    useGooglePay();
  const {createToken} = useStripe();

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

  const pay = async () => {
    const paymentIntent: any = await createPaymentIntent(
      '2000',
      'cus_N1sK1wkPv19VpS',
      'Test',
    );

    const {error} = await presentGooglePay({
      clientSecret: paymentIntent.client_secret,
      forSetupIntent: false,
    });

    if (error) {
      Alert.alert(error.code, error.message);
      // Update UI to prompt user to retry payment (and possibly another payment method)
      return;
    }
    Alert.alert('Success', 'The payment was confirmed successfully.');
  };

  const SECRET_KEY =
    'sk_test_51MByzESBjPqYFi2gAPWJkALPvhgqdljMslYxfRHC0EXIzn6fG8fI2kG3xcbPMnDGFeYudMro1m7tIz54dCtAbNTy00Y5ePNk0a';
  const CUSTOMER_ID = 'cus_N0edNYpkFRYpF6';

  const initialize = async () => {
    const token = await createToken({type: 'Card'});

    // const response = await createPaymentMethod({paymentMethodType: 'Card'});
    // console.log(response);

    // const respons = await confirmPayment(
    //   'pi_3MH8ctFRS4M4CePp1SaSbxLm_secret_nfvALkL5l3PYMNdcjhP97NNns',
    // );

    // console.log(respons);
  };

  //   useEffect(() => {
  //     initialize();
  //   }, []);

  return (
    <View>
      {/* <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
      /> */}
      <Button onPress={pay} title="CreatePaymentMethod" />
    </View>
  );
};

export default CustomStripeWidgetScreen;
