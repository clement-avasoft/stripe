import {
  CardField,
  useStripe,
  PaymentMethod,
  CardForm,
} from '@stripe/stripe-react-native';
import React, {useEffect} from 'react';
import {Button, View} from 'react-native';

const CustomStripeWidgetScreen = () => {
  const {
    initPaymentSheet,
    presentPaymentSheet,
    confirmPaymentSheetPayment,
    confirmPayment,
    createPaymentMethod,
    retrieveSetupIntent,
    retrievePaymentIntent,
    createToken,
  } = useStripe();

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
      <Button onPress={initialize} title="CreatePaymentMethod" />
    </View>
  );
};

export default CustomStripeWidgetScreen;
