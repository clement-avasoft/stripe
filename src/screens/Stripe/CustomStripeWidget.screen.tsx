import React, {useEffect, useState} from 'react';
import {Alert, Text, TextInput, View} from 'react-native';

import {
  useApplePay,
  useGooglePay,
  useStripe,
} from '@stripe/stripe-react-native';

import CustomButton from '../../components/CustomButton.component';
import DefaultPadding from '../../components/DefaultPadding.component';
import Header from '../../components/Header.component';
import {
  createPaymentIntent,
  updatePaymentIntent,
} from '../../services/stripe/payment_intent.service';
import {
  attachPaymentMethod,
  createPaymentMethod,
} from '../../services/stripe/payment_method.service';

interface CustomStripeWidgetScreenProps {
  route: any;
  navigation: any;
}

interface CardDetail {
  cardNumber: string;
  year: string;
  month: string;
  cvv: string;
}

interface CardDetailError {
  cardNumber: string;
  year: string;
  month: string;
  cvv: string;
}

const CustomStripeWidgetScreen: React.FC<CustomStripeWidgetScreenProps> = ({
  route,
  navigation,
}) => {
  const [cardDetail, setCardDetail] = useState<CardDetail>({
    cardNumber: '',
    year: '',
    month: '',
    cvv: '',
  });
  const [cardDetailError, setCardDetailError] = useState<CardDetailError>({
    cardNumber: '',
    year: '',
    month: '',
    cvv: '',
  });
  const [loaderOnPay, setLoaderOnPay] = useState<boolean>(false);
  const [loaderOnGooglePay, setLoaderOnGooglePay] = useState<boolean>(false);
  const [loaderOnApplePay, setLoaderOnApplePay] = useState<boolean>(false);
  const [isGPaySupported, setIsGPaySupported] = useState<boolean>(true);

  const {isGooglePaySupported, initGooglePay, presentGooglePay} =
    useGooglePay();
  const {isApplePaySupported, presentApplePay, confirmApplePayPayment} =
    useApplePay();
  const {confirmPayment} = useStripe();

  const {paymentIntent, customerId} = route.params;

  useEffect(() => {
    initializeGooglePay();
  }, []);

  const initializeGooglePay = async () => {
    if (!(await isGooglePaySupported({testEnv: true}))) {
      return setIsGPaySupported(false);
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

  const doGooglePay = async () => {
    setLoaderOnGooglePay(true);
    const {error} = await presentGooglePay({
      clientSecret: paymentIntent.client_secret,
      forSetupIntent: false,
    });

    if (error) {
      setLoaderOnGooglePay(false);
      return Alert.alert(error.code, error.message);
    }

    setLoaderOnGooglePay(false);
    Alert.alert(
      'Success',
      'The payment was confirmed successfully.',
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

  const doApplePay = async () => {
    setLoaderOnApplePay(true);
    if (!isApplePaySupported) {
      setLoaderOnApplePay(false);
      return;
    }

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
      setLoaderOnApplePay(false);
      return Alert.alert(error.code, error.message);
    }

    const paymentIntent: any = await createPaymentIntent(
      2000,
      'cus_N1pdOTHYFbsxxI',
      'Test',
    );

    const {error: confirmError} = await confirmApplePayPayment(
      paymentIntent.client_secret,
    );

    if (confirmError) {
      setLoaderOnApplePay(false);
      return Alert.alert(confirmError.code, confirmError.message);
    }

    setLoaderOnApplePay(false);
    Alert.alert(
      'Success',
      'The payment was confirmed successfully.',
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

  const doPay = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      setCardDetailError({
        cardNumber:
          cardDetail.cardNumber.length < 19
            ? 'Please enter the full card number'
            : '',
        year:
          !cardDetail.year || parseInt(cardDetail.year) < currentYear
            ? 'Please enter the valid year'
            : '',
        month:
          !cardDetail.month ||
          parseInt(cardDetail.year) < currentYear ||
          (parseInt(cardDetail.year) === currentYear &&
            parseInt(cardDetail.month) < currentMonth) ||
          parseInt(cardDetail.month) > 12
            ? 'Please enter the valid month'
            : '',
        cvv: cardDetail.cvv.length < 3 ? 'Please enter the valid cvv' : '',
      });

      if (
        cardDetail.cardNumber.length < 19 ||
        !cardDetail.year ||
        parseInt(cardDetail.year) < currentYear ||
        !cardDetail.month ||
        parseInt(cardDetail.year) < currentYear ||
        (parseInt(cardDetail.year) === currentYear &&
          parseInt(cardDetail.month) < currentMonth) ||
        parseInt(cardDetail.month) > 12 ||
        cardDetail.cvv.length < 3
      ) {
        return;
      }

      setLoaderOnPay(true);
      const paymentMethod = await createPaymentMethod(
        'card',
        cardDetail.cardNumber,
        cardDetail.year,
        cardDetail.month,
        cardDetail.cvv,
      );

      await attachPaymentMethod(paymentMethod.id, customerId);
      await updatePaymentIntent(paymentIntent.id, paymentMethod.id);
      const {error} = await confirmPayment(paymentIntent.client_secret);

      if (error) {
        setLoaderOnPay(false);
        return Alert.alert(error.code, error.message);
      }

      setLoaderOnPay(false);
      Alert.alert(
        'Success',
        'The payment was confirmed successfully.',
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
    } catch (error: any) {
      Alert.alert('Failed', error);
    }
  };

  const formatCardNumber = (text: string) => {
    let formattedText = text.split(' ').join('');
    formattedText = formattedText
      .match(new RegExp('.{1,4}', 'g'))
      ?.join(' ') as string;

    return formattedText;
  };

  const handleCardNumber = (text: string) => {
    if (text.length === 19) {
      setCardDetailError({
        cardNumber: '',
        year: cardDetailError.year,
        month: cardDetailError.month,
        cvv: cardDetailError.cvv,
      });
    }

    return setCardDetail({
      cardNumber: text,
      year: cardDetail.year,
      month: cardDetail.month,
      cvv: cardDetail.cvv,
    });
  };

  const handleExpYear = (text: string) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (
      parseInt(text) >= currentYear ||
      (parseInt(text) >= currentYear &&
        parseInt(cardDetail.month) >= currentMonth)
    ) {
      setCardDetailError({
        cardNumber: cardDetailError!.cardNumber,
        year: '',
        month: cardDetail.month ? '' : cardDetailError.month,
        cvv: cardDetailError!.cvv,
      });
    }

    return setCardDetail({
      cardNumber: cardDetail.cardNumber,
      year: text,
      month: cardDetail.month,
      cvv: cardDetail.cvv,
    });
  };

  const handleExpMonth = (text: string) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (
      (parseInt(cardDetail.year) === currentYear &&
        parseInt(text) >= currentMonth) ||
      parseInt(cardDetail.year) > currentYear
    ) {
      setCardDetailError({
        cardNumber: cardDetailError.cardNumber,
        year: cardDetailError.year,
        month: '',
        cvv: cardDetailError.cvv,
      });
    }

    return setCardDetail({
      cardNumber: cardDetail.cardNumber,
      year: cardDetail.year,
      month: text,
      cvv: cardDetail.cvv,
    });
  };

  const handleCvv = (text: string) => {
    if (text.length === 3) {
      setCardDetailError({
        cardNumber: cardDetailError.cardNumber,
        year: cardDetailError.year,
        month: cardDetailError.month,
        cvv: '',
      });
    }

    return setCardDetail({
      cardNumber: cardDetail.cardNumber,
      year: cardDetail.year,
      month: cardDetail.month,
      cvv: text,
    });
  };

  return (
    <View style={{flex: 1}}>
      <Header value={'Stripe Native Elements'} />
      <DefaultPadding style={{marginTop: 75}}>
        <View style={{marginBottom: 27}}>
          <TextInput
            style={{
              height: 40,
              width: '100%',
              borderRadius: 8,
              padding: 10,
              backgroundColor: '#F5F5F5',
              marginBottom: 3,
            }}
            placeholder="Card Number"
            onChangeText={(text: string) => {
              handleCardNumber(text);
            }}
            editable={
              loaderOnPay || loaderOnApplePay || loaderOnGooglePay
                ? false
                : true
            }
            defaultValue={
              cardDetail.cardNumber
                ? formatCardNumber(cardDetail.cardNumber)
                : ''
            }
            keyboardType="numeric"
            maxLength={19}
          />
          <Text style={{color: '#DB4437'}}>
            {cardDetailError.cardNumber ? cardDetailError.cardNumber : null}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              marginBottom: 27,
              width: '45%',
            }}>
            <TextInput
              style={{
                height: 40,
                width: '100%',
                borderRadius: 8,
                padding: 10,
                backgroundColor: '#F5F5F5',
                marginBottom: 3,
              }}
              placeholder="Exp Year"
              onChangeText={(text: string) => {
                handleExpYear(text);
              }}
              editable={
                loaderOnPay || loaderOnApplePay || loaderOnGooglePay
                  ? false
                  : true
              }
              keyboardType="numeric"
              maxLength={4}
            />
            <Text style={{color: '#DB4437'}}>
              {cardDetailError.year ? cardDetailError.year : null}
            </Text>
          </View>
          <View
            style={{
              marginBottom: 27,
              width: '45%',
            }}>
            <TextInput
              style={{
                height: 40,
                width: '100%',
                borderRadius: 8,
                padding: 10,
                backgroundColor: '#F5F5F5',
                marginBottom: 3,
              }}
              placeholder="Exp Month"
              onChangeText={(text: string) => {
                handleExpMonth(text);
              }}
              editable={
                loaderOnPay || loaderOnApplePay || loaderOnGooglePay
                  ? false
                  : true
              }
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={{color: '#DB4437'}}>
              {cardDetailError.month ? cardDetailError.month : null}
            </Text>
          </View>
        </View>
        <View style={{width: '100%'}}></View>
        <View style={{marginBottom: 27}}>
          <TextInput
            style={{
              height: 40,
              width: '100%',
              borderRadius: 8,
              padding: 10,
              backgroundColor: '#F5F5F5',
              marginBottom: 3,
            }}
            placeholder="CVV"
            onChangeText={(text: string) => {
              handleCvv(text);
            }}
            editable={
              loaderOnPay || loaderOnApplePay || loaderOnGooglePay
                ? false
                : true
            }
            keyboardType="numeric"
            maxLength={3}
          />
          <Text style={{color: '#DB4437'}}>
            {cardDetailError.cvv ? cardDetailError.cvv : null}
          </Text>
        </View>

        <CustomButton
          value={loaderOnPay ? '' : 'Pay'}
          textColor="#ffffff"
          onPress={doPay}
          loaderColor="#6FBAFF"
          backgroundColor={loaderOnPay ? '#D3D3D35A' : ''}
          disable={
            loaderOnPay || loaderOnApplePay || loaderOnGooglePay ? true : false
          }
          loading={loaderOnPay ? true : false}
          style={{paddingTop: 40}}
        />
        {isGPaySupported ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text>or</Text>
          </View>
        ) : null}
        {isGPaySupported ? (
          <CustomButton
            value={loaderOnGooglePay ? '' : 'Google Pay'}
            textColor="#ffffff"
            onPress={doGooglePay}
            loaderColor="#6FBAFF"
            backgroundColor={loaderOnGooglePay ? '#D3D3D35A' : ''}
            disable={
              loaderOnPay || loaderOnApplePay || loaderOnGooglePay
                ? true
                : false
            }
            loading={loaderOnGooglePay ? true : false}
            style={{paddingTop: 40}}
          />
        ) : null}
        {isApplePaySupported ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text>or</Text>
          </View>
        ) : null}
        {isApplePaySupported ? (
          <CustomButton
            value={loaderOnApplePay ? '' : 'Apple Pay'}
            textColor="#ffffff"
            onPress={doApplePay}
            loaderColor="#6FBAFF"
            backgroundColor={loaderOnApplePay ? '#D3D3D35A' : ''}
            disable={
              loaderOnPay || loaderOnApplePay || loaderOnGooglePay
                ? true
                : false
            }
            loading={loaderOnApplePay ? true : false}
            style={{paddingTop: 40}}
          />
        ) : null}
      </DefaultPadding>
    </View>
  );
};

export default CustomStripeWidgetScreen;
