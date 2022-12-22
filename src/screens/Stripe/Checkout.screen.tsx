import React, {useEffect, useState} from 'react';
import {Alert, Button, TextInput, View} from 'react-native';
import DefaultPadding from '../../components/DefaultPadding.component';
import Header from '../../components/Header.component';
import {createEphemeralKey} from '../../services/stripe/customer.service';
import {createPaymentIntent} from '../../services/stripe/payment_intent.service';

interface CheckoutScreenProps {
  route: any;
  navigation: any;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({route, navigation}) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const {customerId} = route.params;

  const onCheckoutPressed = async () => {
    const ephemeralKey: any = await createEphemeralKey(customerId);

    const paymentIntent: any = await createPaymentIntent(
      amount,
      customerId,
      description,
    );

    if (!paymentIntent) {
      return Alert.alert('Error', 'Payment-Intent Creation Error');
    }

    navigation.navigate('PaymentScreen', {
      customerId: customerId,
      ephemeralSecret: ephemeralKey.secret,
      clientSecret: paymentIntent.client_secret,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
      }}>
      <Header value="Checkout" />
      <DefaultPadding style={{marginTop: 75}}>
        <TextInput
          style={{
            height: 40,
            width: '100%',
            borderRadius: 8,
            padding: 10,
            backgroundColor: '#F5F5F5',
            marginBottom: 20,
          }}
          placeholder="Enter Amount"
          onChangeText={(text: string) => {
            setAmount(text);
          }}
        />
        <TextInput
          style={{
            height: 40,
            width: '100%',
            borderRadius: 8,
            padding: 10,
            backgroundColor: '#F5F5F5',
            marginBottom: 30,
          }}
          placeholder="Enter Description"
          onChangeText={(text: string) => {
            setDescription(text);
          }}
        />
        <Button title="Checkout" color="#6FBAFF" onPress={onCheckoutPressed} />
      </DefaultPadding>
    </View>
  );
};

export default CheckoutScreen;
