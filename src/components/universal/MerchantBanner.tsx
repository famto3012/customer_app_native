import { Image, StyleSheet, View } from "react-native";
import { FC, useCallback } from "react";
import { SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { interpolate } from "react-native-reanimated";
import Carousel, { TAnimationStyle } from "react-native-reanimated-carousel";
import { useQuery } from "@tanstack/react-query";
import { getMerchantBanners } from "@/service/universal";
import { spacingX, spacingY } from "@/constants/theme";

const MerchantBanner: FC<{ merchantId: string }> = ({ merchantId }) => {
  const { data, isLoading } = useQuery<{ imageURL: string }[]>({
    queryKey: ["merchant-banner", merchantId],
    queryFn: () => getMerchantBanners(merchantId),
  });

  const animationStyle: TAnimationStyle = useCallback((value: number) => {
    "worklet";

    const zIndex = Math.round(interpolate(value, [-1, 0, 1], [10, 20, 30]));
    const scale = interpolate(value, [-1, 0, 1], [1.25, 1, 0.25]);
    const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 0]);

    return {
      transform: [{ scale: Number(scale) }],
      zIndex: zIndex,
      opacity: Number(opacity),
    };
  }, []);

  return (
    <View>
      {data && data?.length > 0 && (
        <Carousel
          loop
          style={styles.merchantBanner}
          autoPlay
          autoPlayInterval={4000}
          scrollAnimationDuration={2000}
          width={Math.round(SCREEN_WIDTH - 40)}
          height={Math.round(verticalScale(100))}
          data={data || []}
          renderItem={({ item }: any) => (
            <Image
              source={{
                uri: item.imageURL,
              }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}
          customAnimation={animationStyle}
        />
      )}
    </View>
  );
};

export default MerchantBanner;

const styles = StyleSheet.create({
  merchantBanner: {
    width: SCREEN_WIDTH - 40,
    height: verticalScale(100),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacingY._15,
    marginHorizontal: spacingX._15,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
});
