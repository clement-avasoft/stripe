import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface CustomButtonProps {
  value: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  style?: ViewStyle;
  textColor?: string | undefined;
  disable?: boolean;
  textStyle?: StyleProp<TextStyle>;
  backgroundColor?: string | undefined;
  loaderColor?: string | undefined;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  value,
  onPress,
  style,
  backgroundColor,
  textColor,
  disable,
  textStyle,
  loaderColor,
  loading,
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.pressableStyle, style]}
    disabled={disable}>
    <View
      style={[
        styles.buttonStyle,
        {position: 'absolute'},
        backgroundColor
          ? {backgroundColor: backgroundColor}
          : {backgroundColor: '#6FBAFF'},
      ]}>
      <Text
        style={[
          textStyle,
          {fontWeight: '700'},
          textColor ? {color: textColor} : {color: '#ffffff'},
        ]}>
        {value}
      </Text>
    </View>
    {loading ? (
      <View
        style={[
          {
            width: '100%',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          },
        ]}>
        <ActivityIndicator size="small" color={loaderColor} />
      </View>
    ) : null}
  </Pressable>
);

const styles = StyleSheet.create({
  buttonStyle: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6FBAFF',
  },
  pressableStyle: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomButton;
