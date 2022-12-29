import * as React from 'react';

import {SafeAreaView} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StripeProvider} from '@stripe/stripe-react-native';

import CheckoutScreen from './src/screens/Stripe/Checkout.screen';
import CustomerFormScreen from './src/screens/Stripe/CustomerForm.screen';
import CustomStripeWidgetScreen from './src/screens/Stripe/CustomStripeWidget.screen';
import PaymentScreen from './src/screens/Stripe/Payment.screen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StripeProvider
        publishableKey="pk_test_51MH5jwFRS4M4CePpgDiykMPrHJ65NeMOgSaSsavtPdNSOCg4xjiaeO18nZLP0GGL82OFMvnyYxTeHaq1ifsixsp200MvSHPxFD"
        urlScheme="your-url-scheme"
        merchantIdentifier="merchant.org.reactjs.native.example.AvasoftStripe">
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="CustomerFormScreen"
              component={CustomerFormScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CheckoutScreen"
              component={CheckoutScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CustomStripeWidgetScreen"
              component={CustomStripeWidgetScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StripeProvider>
    </SafeAreaView>
  );
};

export default App;
