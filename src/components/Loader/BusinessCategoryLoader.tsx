import { scale, verticalScale } from "@/utils/styling";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const BusinessCategoryLoader = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={{
              width: scale(90),
              height: scale(90),
              marginRight: scale(10),
              marginBottom: verticalScale(15),
            }}
          />
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export default BusinessCategoryLoader;
