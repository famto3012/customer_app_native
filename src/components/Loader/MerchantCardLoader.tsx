import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SCREEN_WIDTH } from "@/utils/styling";
import { spacingY } from "@/constants/theme";

const MerchantCardLoader = () => {
  return (
    <View style={{ gap: spacingY._20 }}>
      {[1, 2].map((_, index) => (
        <View key={index}>
          <SkeletonPlaceholder borderRadius={4}>
            <SkeletonPlaceholder.Item flexDirection="column">
              <SkeletonPlaceholder.Item
                width={SCREEN_WIDTH - 40}
                height={120}
                borderRadius={10}
              />

              <SkeletonPlaceholder.Item
                marginTop={20}
                flexDirection="row"
                justifyContent="space-between"
              >
                <SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item width={120} height={20} />
                  <SkeletonPlaceholder.Item
                    marginTop={6}
                    width={80}
                    height={20}
                  />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={120} height={20} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ))}
    </View>
  );
};

export default MerchantCardLoader;
