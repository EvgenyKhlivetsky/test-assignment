import { ActivityIndicator, View, StyleSheet } from "react-native";

export const Spinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="orange" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
