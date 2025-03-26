import { View, Text } from "react-native";
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SCREEN_WIDTH, verticalScale } from "@/utils/styling";

const VehicleLoader = () => {
  return (
    <View style={{ flex: 1 }}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="column">
          {[1, 2].map((_, index) => (
            <View key={index}>
              <SkeletonPlaceholder.Item
                width={SCREEN_WIDTH - 40}
                height={80}
                borderRadius={10}
                marginTop={verticalScale(20)}
              />
            </View>
          ))}
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default VehicleLoader;
