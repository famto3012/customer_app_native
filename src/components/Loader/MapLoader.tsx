import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SCREEN_WIDTH } from "@/utils/styling";
import { spacingY } from "@/constants/theme";

const MapLoader = () => {
  return (
    <View>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="column">
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 40}
            height={180}
            borderRadius={10}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default MapLoader;
