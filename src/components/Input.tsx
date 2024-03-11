import { TextInput, View, StyleSheet } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};
export const Input = ({ value, onChangeText, placeholder }: Props) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "orange",
  },
  input: {
    fontSize: 18,
    borderRadius: 10,
    padding: 16,
  },
});
