import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';

import {createEphemeralKey} from '../../services/stripe/customer.service';
import {createPaymentIntent} from '../../services/stripe/payment_intent.service';

import CustomButton from '../../components/CustomButton.component';
import DefaultPadding from '../../components/DefaultPadding.component';
import Header from '../../components/Header.component';

interface CheckoutScreenProps {
  route: any;
  navigation: any;
}

interface CheckoutFieldsError {
  amount: string;
  description: string;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({route, navigation}) => {
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [checkoutFieldsError, setCheckoutFieldsError] =
    useState<CheckoutFieldsError>({
      amount: '',
      description: '',
    });

  const {customerId} = route.params;

  const onCheckoutPressed = async () => {
    if (!amount) {
      return setCheckoutFieldsError({
        amount: 'Please enter the amount',
        description: checkoutFieldsError!.description,
      });
    }

    if (amount === 0) {
      return setCheckoutFieldsError({
        amount: 'Checkout amount should be greater than 0',
        description: checkoutFieldsError!.description,
      });
    }

    if (description.length === 0) {
      return setCheckoutFieldsError({
        amount: checkoutFieldsError!.amount,
        description: 'Please enter the description',
      });
    }

    setLoading(true);
    const ephemeralKey: any = await createEphemeralKey(customerId);

    const paymentIntent: any = await createPaymentIntent(
      amount!,
      customerId,
      description,
    );

    if (!paymentIntent) {
      setLoading(false);
      return Alert.alert('Error', 'Payment-Intent Creation Error');
    }

    setLoading(false);
    navigation.navigate('PaymentScreen', {
      customerId: customerId,
      ephemeralSecret: ephemeralKey.secret,
      paymentIntent: paymentIntent,
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
        <View style={{marginBottom: 20}}>
          <TextInput
            style={{
              height: 40,
              width: '100%',
              borderRadius: 8,
              padding: 10,
              backgroundColor: '#F5F5F5',
              marginBottom: 3,
            }}
            placeholder="Enter Amount"
            onChangeText={(text: string) => {
              if (!text) {
                return setCheckoutFieldsError({
                  amount: 'Please enter the amount',
                  description: checkoutFieldsError!.description,
                });
              }

              if (parseInt(text) === 0) {
                return setCheckoutFieldsError({
                  amount: 'Checkout amount should be greater than 0',
                  description: checkoutFieldsError!.description,
                });
              }

              setCheckoutFieldsError({
                amount: '',
                description: checkoutFieldsError!.description,
              });
              setAmount(parseInt(text));
            }}
            onBlur={() => {
              if (!amount) {
                return setCheckoutFieldsError({
                  amount: 'Please enter the amount',
                  description: checkoutFieldsError!.description,
                });
              }

              if (amount === 0) {
                return setCheckoutFieldsError({
                  amount: 'Checkout amount should be greater than 0',
                  description: checkoutFieldsError!.description,
                });
              }

              setCheckoutFieldsError({
                amount: '',
                description: checkoutFieldsError!.description,
              });
            }}
            defaultValue={amount ? amount.toString() : ''}
            editable={loading ? false : true}
            keyboardType="numeric"
          />
          <Text style={{color: '#DB4437'}}>
            {checkoutFieldsError!.amount ? checkoutFieldsError!.amount : null}
          </Text>
        </View>

        <View style={{marginBottom: 30}}>
          <TextInput
            style={{
              height: 40,
              width: '100%',
              borderRadius: 8,
              padding: 10,
              backgroundColor: '#F5F5F5',
              marginBottom: 3,
            }}
            placeholder="Enter Description"
            onChangeText={(text: string) => {
              if (text.length === 0) {
                return setCheckoutFieldsError({
                  amount: checkoutFieldsError!.amount,
                  description: 'Please enter the description',
                });
              }

              setCheckoutFieldsError({
                amount: checkoutFieldsError!.amount,
                description: '',
              });
              setDescription(text);
            }}
            onBlur={() => {
              if (description.length === 0) {
                return setCheckoutFieldsError({
                  amount: checkoutFieldsError!.amount,
                  description: 'Please enter the description',
                });
              }

              setCheckoutFieldsError({
                amount: checkoutFieldsError!.amount,
                description: '',
              });
            }}
            defaultValue={description}
            editable={loading ? false : true}
          />
          <Text style={{color: '#DB4437'}}>
            {checkoutFieldsError!.description
              ? checkoutFieldsError!.description
              : null}
          </Text>
        </View>

        <CustomButton
          value={loading ? '' : 'Checkout'}
          textColor="#ffffff"
          onPress={onCheckoutPressed}
          loaderColor="#6FBAFF"
          backgroundColor={loading ? '#D3D3D35A' : ''}
          disable={loading ? true : false}
          loading={loading ? true : false}
          style={{paddingTop: 40}}
        />
      </DefaultPadding>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CheckoutScreen;
