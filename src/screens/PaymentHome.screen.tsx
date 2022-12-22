import React from 'react';
import {Button, Dimensions, Pressable, View} from 'react-native';
const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const PaymentHomeScreen = ({navigation}: any) => {
  return (
    <View
      style={{
        width: windowWidth,
        height: windowHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View>
        <Button
          onPress={() => navigation.navigate('StripeWidget')}
          title="Stripe Widget"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <View style={{marginTop: 15}}>
          <Button
            onPress={() => navigation.navigate('StripeCustomWidget')}
            title="Custom Stripe Widget"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
    </View>
  );
};

export default PaymentHomeScreen;
