import React, {useEffect, useState} from 'react';

import {useStripe} from '@stripe/stripe-react-native';
import {Alert, StyleSheet, View} from 'react-native';

import CustomButton from '../../components/CustomButton.component';
import DefaultPadding from '../../components/DefaultPadding.component';
import Header from '../../components/Header.component';

interface PaymentScreenProps {
  route: any;
  navigation: any;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({route, navigation}) => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState<boolean>(false);
  const {customerId, ephemeralSecret, paymentIntent} = route.params;

  useEffect(() => {
    initializePaymentSheet();
  }, [customerId && ephemeralSecret && paymentIntent.client_secret]);

  const initializePaymentSheet = async () => {
    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Avasoft, Inc.',
      customerId: customerId,
      customerEphemeralKeySecret: ephemeralSecret,
      paymentIntentClientSecret: paymentIntent.client_secret,
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
    setLoading(true);
    const {error}: any = await presentPaymentSheet();

    if (error) {
      setLoading(false);
      return Alert.alert(`Error code: ${error.code}`, error.message);
    }

    setLoading(false);
    Alert.alert(
      'Success',
      'Your order is confirmed!',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('CustomerFormScreen');
          },
        },
      ],
      {cancelable: false},
    );
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
          <CustomButton
            value={'Stripe Native Element'}
            textColor="#ffffff"
            onPress={() =>
              navigation.navigate('CustomStripeWidgetScreen', {
                paymentIntent: paymentIntent,
                customerId: customerId,
              })
            }
            loaderColor="#6FBAFF"
            disable={loading ? true : false}
          />
        </View>

        <CustomButton
          value={loading ? '' : 'Stripe UI'}
          textColor="#ffffff"
          onPress={onStripeUIClicked}
          loaderColor="#6FBAFF"
          backgroundColor={loading ? '#D3D3D35A' : ''}
          disable={loading ? true : false}
          loading={loading ? true : false}
          style={{paddingTop: 50}}
        />
      </DefaultPadding>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PaymentScreen;
