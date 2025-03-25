import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { spacingY } from "@/constants/theme";

const AddressLoader = () => {
  return (
    <View
      style={{
        paddingHorizontal: scale(20),
        marginTop: verticalScale(20),
        gap: spacingY._20,
      }}
    >
      {[1, 2, 3].map((_, index) => (
        <View key={index}>
          <SkeletonPlaceholder borderRadius={4}>
            <SkeletonPlaceholder.Item flexDirection="column">
              <SkeletonPlaceholder.Item
                width={SCREEN_WIDTH - 45}
                height={130}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ))}
    </View>
  );
};

export default AddressLoader;

const styles = StyleSheet.create({});
