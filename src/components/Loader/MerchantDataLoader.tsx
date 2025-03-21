import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SCREEN_WIDTH } from "@/utils/styling";
import { spacingY } from "@/constants/theme";

const MerchantDataLoader = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
        <SkeletonPlaceholder.Item
          flexDirection="column"
          gap={spacingY._10}
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item width={SCREEN_WIDTH * 0.5} height={30} />
          <SkeletonPlaceholder.Item width={SCREEN_WIDTH * 0.5} height={20} />
          <SkeletonPlaceholder.Item width={SCREEN_WIDTH * 0.5} height={10} />
          <SkeletonPlaceholder.Item width={SCREEN_WIDTH * 0.5} height={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default MerchantDataLoader;
