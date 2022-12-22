import React from 'react';
import {Text, View} from 'react-native';

interface HeaderProps {
  value: string;
}

const Header: React.FC<HeaderProps> = ({value}) => {
  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: '#000000',
        }}>
        {value}
      </Text>
    </View>
  );
};

export default Header;
