import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CheckoutScreen from './src/screens/Stripe/Checkout.screen';
import CustomerFormScreen from './src/screens/Stripe/CustomerForm.screen';
import CustomStripeWidgetScreen from './src/screens/CustomStripeWidget.screen';
import PaymentScreen from './src/screens/Stripe/Payment.screen';

import StripeWidget from './src/components/stripe/StripeWidget.component';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="CustomStripeWidgetScreen"
          component={CustomStripeWidgetScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CustomerFormScreen"
          component={CustomerFormScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StripeWidget"
          component={StripeWidget}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;