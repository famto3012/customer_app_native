import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Address from "@/components/common/Address";
import { verticalScale } from "@/utils/styling";

const UserAddress = () => {
  return (
    <ScreenWrapper>
      <Header title="Saved addresses" />

      <View style={{ marginTop: verticalScale(30) }}>
        <Address />
      </View>
    </ScreenWrapper>
  );
};

export default UserAddress;

const styles = StyleSheet.create({});
