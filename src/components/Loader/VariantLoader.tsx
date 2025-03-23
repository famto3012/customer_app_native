import { View } from "react-native";
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SCREEN_WIDTH, verticalScale } from "@/utils/styling";

const VariantLoader = () => {
  return (
    <View style={{ flex: 1 }}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="column">
          {/* Title Placeholder */}
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH * 0.4}
            height={30}
            marginTop={verticalScale(20)}
          />

          {/* Ensuring multiple rows are displayed */}
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={{ marginTop: verticalScale(15) }}>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <SkeletonPlaceholder.Item
                  width={SCREEN_WIDTH * 0.4}
                  height={30}
                />
                <SkeletonPlaceholder.Item
                  width={SCREEN_WIDTH * 0.2}
                  height={30}
                />
              </SkeletonPlaceholder.Item>
            </View>
          ))}
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default VariantLoader;
