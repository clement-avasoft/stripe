import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

interface DefaultPaddingProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const DefaultPadding: React.FC<DefaultPaddingProps> = ({children, style}) => {
  return (
    <View style={[{paddingLeft: 40, paddingRight: 40}, style]}>{children}</View>
  );
};

export default DefaultPadding;
