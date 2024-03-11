import { ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Checkbox } from "../components/Checkbox";

type Props = {
  name: string;
  onPress: () => void;
  children?: ReactNode;
  isLoading?: boolean;
  backgroundColor?: string;
  spacingLeft?: boolean;
  checked: "all" | "some" | "none";
  onChangeCheck: () => void;
};
export const ExpandItem = ({
  name,
  onPress,
  children,
  isLoading,
  backgroundColor,
  spacingLeft = true,
  checked,
  onChangeCheck,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor, marginLeft: spacingLeft ? 24 : 0 },
      ]}
      onPress={onPress}
    >
      <View style={styles.nameContainer}>
        <View style={styles.row}>
          <Checkbox checked={checked} onPress={onChangeCheck} />
          <Text style={styles.text}>{name}</Text>
        </View>
        {isLoading && <ActivityIndicator size="large" color="orange" />}
      </View>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    minHeight: 64,
    borderRadius: 10,
    marginVertical: 10,
    marginLeft: 24,
    flex: 1,
  },
  text: {
    fontSize: 24,
    marginHorizontal: 12,
  },
  nameContainer: {
    width: "100%",
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
