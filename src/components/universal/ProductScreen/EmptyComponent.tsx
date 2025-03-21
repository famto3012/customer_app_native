import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";

const EmptyComponent: FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories found</Text>
        </View>
      )}
    </>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
