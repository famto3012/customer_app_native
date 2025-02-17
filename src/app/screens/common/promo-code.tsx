import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const PromoCode = () => {
  const { deliveryMode } = useLocalSearchParams();

  return (
    <View>
      <Text>Promo code for {deliveryMode.toString()}</Text>
    </View>
  );
};

export default PromoCode;

const styles = StyleSheet.create({});
