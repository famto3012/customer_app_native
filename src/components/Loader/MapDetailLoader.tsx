import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SCREEN_WIDTH } from "@/utils/styling";

const MapDetailLoader = () => {
  return (
    <View>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="column">
          <SkeletonPlaceholder.Item
            marginTop={5}
            flexDirection="column"
            justifyContent="space-between"
          >
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={SCREEN_WIDTH * 0.9}
                height={60}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={110}
                height={30}
                borderRadius={5}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            marginTop={10}
            width={SCREEN_WIDTH * 0.89}
            height={50}
            borderRadius={40}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default MapDetailLoader;
