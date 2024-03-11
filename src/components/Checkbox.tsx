import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

type Props = {
  checked: "all" | "none" | "some";
  onPress: () => void;
};

const getCheckState = (checked: "all" | "none" | "some") => {
  switch (checked) {
    case "all":
      return "✓";
    case "none":
      return "";
    case "some":
      return "-";
    default:
      return "";
  }
};
export const Checkbox = ({ checked, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkbox}>
      <View style={styles.inner}>
        <Text style={styles.checkmark}>{getCheckState(checked)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },

  inner: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "orange",
    fontWeight: "bold",
  },
});
