import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';

import {createCustomer} from '../../services/stripe/customer.service';

import CustomButton from '../../components/CustomButton.component';
import DefaultPadding from '../../components/DefaultPadding.component';
import Header from '../../components/Header.component';

interface CustomerFormProps {
  navigation: any;
}

const CustomerFormScreen: React.FC<CustomerFormProps> = ({navigation}) => {
  const [name, setName] = useState<string>('');
  const [nameFieldError, setNameFieldError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onCreatePressed = async () => {
    if (name.length === 0) {
      return setNameFieldError('Please enter the valid name');
    }

    if (name.length <= 3) {
      return setNameFieldError('Name should be greater than 3 characters');
    }

    setLoading(true);

    const customer: any = await createCustomer(name);
    if (!customer) {
      setLoading(false);
      return Alert.alert('Error', 'Customer Creation Error');
    }

    setLoading(false);
    setName('');
    setNameFieldError('');
    navigation.navigate('CheckoutScreen', {
      customerId: customer.id,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
      }}>
      <Header value={'Customer Form'} />
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
            placeholder="Name"
            onChangeText={(text: string) => {
              if (text.length === 0) {
                return setNameFieldError('Please enter the valid name');
              }

              if (text.length <= 3) {
                return setNameFieldError(
                  'Name should be greater than 3 characters',
                );
              }

              setNameFieldError('');
              setName(text);
            }}
            onBlur={() => {}}
            defaultValue={name}
            editable={loading ? false : true}
            maxLength={19}
          />
          <View>
            <Text style={{color: '#DB4437'}}>
              {nameFieldError ? nameFieldError : null}
            </Text>
          </View>
        </View>
        <CustomButton
          value={loading ? '' : 'Create'}
          textColor="#ffffff"
          onPress={onCreatePressed}
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

export default CustomerFormScreen;
