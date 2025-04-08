import { radius, spacingX, spacingY } from "@/constants/theme";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const ProductCategoryLoader = () => {
  return (
    <View
      style={{
        gap: spacingY._20,
        paddingHorizontal: scale(20),
        width: SCREEN_WIDTH - 40,
        marginVertical: verticalScale(20),
      }}
    >
      {[1, 2, 3].map((_, index) => (
        <View key={index}>
          <SkeletonPlaceholder borderRadius={4}>
            <SkeletonPlaceholder.Item flexDirection="row" gap={spacingX._15}>
              <SkeletonPlaceholder.Item
                width={scale(120)}
                height={verticalScale(120)}
                borderRadius={radius._10}
              />

              <SkeletonPlaceholder.Item
                flexDirection="column"
                gap={spacingY._10}
              >
                <SkeletonPlaceholder.Item width={120} height={20} />
                <SkeletonPlaceholder.Item width={120} height={20} />
                <SkeletonPlaceholder.Item
                  width={SCREEN_WIDTH - scale(175)}
                  height={20}
                />
                <SkeletonPlaceholder.Item
                  width={SCREEN_WIDTH - scale(175)}
                  height={20}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ))}
    </View>
  );
};

export default ProductCategoryLoader;
