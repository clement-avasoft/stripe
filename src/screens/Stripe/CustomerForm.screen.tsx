import React, {useState} from 'react';
import {Alert, Button, TextInput, View} from 'react-native';
import DefaultPadding from '../../components/DefaultPadding.component';
import Header from '../../components/Header.component';
import {createCustomer} from '../../services/stripe/customer.service';

interface CustomerFormProps {
  navigation: any;
}

const CustomerFormScreen: React.FC<CustomerFormProps> = ({navigation}) => {
  const [name, setName] = useState<string>('');

  const onCreatePressed = async () => {
    const customer: any = await createCustomer(name);

    if (!customer) {
      return Alert.alert('Error', 'Customer Creation Error');
    }

    navigation.navigate('Checkout', {
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
        <TextInput
          style={{
            height: 40,
            width: '100%',
            borderRadius: 8,
            padding: 10,
            backgroundColor: '#F5F5F5',
            marginBottom: 30,
          }}
          placeholder="Name"
          onChangeText={(text: string) => {
            setName(text);
          }}
        />
        <Button title="Create" color="#6FBAFF" onPress={onCreatePressed} />
      </DefaultPadding>
    </View>
  );
};

export default CustomerFormScreen;
