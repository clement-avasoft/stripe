import React, {useEffect} from 'react';
import {Alert, Button, View} from 'react-native';

import {useStripe} from '@stripe/stripe-react-native';

import DefaultPadding from '../../components/DefaultPadding.component';
import Header from '../../components/Header.component';

interface PaymentScreenProps {
  route: any;
  navigation: any;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({route, navigation}) => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {customerId, ephemeralSecret, clientSecret} = route.params;

  useEffect(() => {
    initializePaymentSheet();
  }, [customerId && ephemeralSecret && clientSecret]);

  const initializePaymentSheet = async () => {
    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Avasoft, Inc.',
      customerId: customerId,
      customerEphemeralKeySecret: ephemeralSecret,
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: true,
        currencyCode: 'USD',
      },
      applePay: {
        merchantCountryCode: 'US',
      },
    });

    if (error) {
      Alert.alert('Payment Failed');
    }
  };

  const onStripeUIClicked = async () => {
    const {error}: any = await presentPaymentSheet();

    if (error) {
      return Alert.alert(`Error code: ${error.code}`, error.message);
    }

    Alert.alert('Success', 'Your order is confirmed!');
  };

  return (
    <View
      style={{
        flex: 2,
        backgroundColor: '#FFFFFF',
      }}>
      <Header value="Payment Screen" />
      <DefaultPadding style={{marginTop: 75}}>
        <View style={{marginBottom: 30}}>
          <Button
            onPress={() => navigation.navigate('CustomStripeWidgetScreen')}
            title="Stripe Native Element"
            color="#6FBAFF"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <Button
          onPress={onStripeUIClicked}
          title="Stripe UI"
          color="#6FBAFF"
          accessibilityLabel="Learn more about this purple button"
        />
      </DefaultPadding>
    </View>
  );
};

export default PaymentScreen;
