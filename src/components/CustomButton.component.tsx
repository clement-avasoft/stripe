import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface CustomButtonProps {
  value: string;
  mode?: 'text' | 'outlined' | 'contained' | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  style?: ViewStyle;
  textColor?: string | undefined;
  disable?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  value,
  mode,
  onPress,
  style,
  textColor,
  disable,
  textStyle,
}) => (
  <Pressable
    onPress={onPress}
    style={[style, {justifyContent: 'center', alignItems: 'center'}]}
    disabled={disable}>
    <Text>{value}</Text>
  </Pressable>
);

export default CustomButton;
