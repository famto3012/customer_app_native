import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { memo, useEffect, useState } from "react";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Typo from "../Typo";
import { Heart, Star } from "phosphor-react-native";
import { MerchantCardProps } from "@/types";
import { toggleMerchantFavorite } from "@/service/universal";
import { useAuthStore } from "@/store/store";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Grayscale } from "react-native-color-matrix-image-filters";

const MerchantCard = ({ item }: { item: MerchantCardProps }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const scale = useSharedValue(1);

  const { selectedBusiness, setSelectedMerchant, setSelectedBusiness } =
    useAuthStore.getState();
  const queryClient = useQueryClient();

  useEffect(() => {
    item.isFavorite ? setIsFavorite(true) : setIsFavorite(false);
  }, [item.isFavorite]);

  const handleFavoriteMutation = useMutation({
    mutationKey: ["merchant-favorite", item.id],
    mutationFn: () => toggleMerchantFavorite(item.id, selectedBusiness),
    onSuccess: (data) => {
      if (data.success) {
        setIsFavorite(!isFavorite);
        scale.value = 1.2;
        scale.value = withSpring(1, { damping: 5, stiffness: 150 });
        queryClient.invalidateQueries({ queryKey: ["favorite-merchant-list"] });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        // if (!item.status) return null;

        if (item.redirectable === false) {
          if (Platform.OS === "android") {
            ToastAndroid.showWithGravity(
              "Merchant currently unavailable",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
            return;
          } else {
            Alert.alert("Error", "Merchant currently unavailable");
            return;
          }
        }

        setSelectedMerchant(item.id, item.merchantName);
        if (item?.businessCategoryId != null) {
          setSelectedBusiness(item.businessCategoryId);
        }
        router.push({
          pathname: "/screens/universal/products",
          params: { merchantId: item.id },
        });
      }}
      // disabled={!item?.redirectable}
    >
      <View style={{ position: "relative" }}>
        {!item.status ? (
          <Grayscale>
            <Image
              source={{ uri: item.merchantImageURL }}
              style={styles.image}
              resizeMode="cover"
            />
          </Grayscale>
        ) : (
          <Image
            source={{ uri: item.merchantImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.ratingContainer}>
        <Star size={16} color={"gold"} weight="fill" />
        <Typo size={13} color={colors.WHITE}>
          {item.averageRating}
        </Typo>
      </View>

      <View style={styles.preOrderContainer}>
        {item.preOrderStatus && (
          <Typo color={colors.WHITE} size={12} style={styles.preOrderText}>
            Pre order
          </Typo>
        )}

        <Pressable
          style={{ padding: 5 }}
          onPress={() => handleFavoriteMutation.mutate()}
        >
          <Animated.View style={animatedStyle}>
            {isFavorite ? (
              <Heart size={20} color={colors.RED} weight="fill" />
            ) : (
              <Heart size={20} color={colors.WHITE} />
            )}
          </Animated.View>
        </Pressable>
      </View>

      <View style={styles.descriptionContainer}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Typo
            fontFamily="Medium"
            size={14}
            color={colors.NEUTRAL900}
            textProps={{ numberOfLines: 1 }}
          >
            {item.merchantName}
          </Typo>
          <Typo
            size={12}
            color={colors.NEUTRAL500}
            style={{ marginTop: verticalScale(9.5) }}
          >
            {item.description}
          </Typo>
        </View>

        <Typo size={12} color={colors.NEUTRAL500}>
          {item.displayAddress}
        </Typo>
      </View>
    </Pressable>
  );
};

export default memo(MerchantCard);

const styles = StyleSheet.create({
  container: {
    borderRadius: radius._10,
    backgroundColor: "white",
    paddingBottom: verticalScale(10),
    shadowColor: colors.NEUTRAL800,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginBottom: verticalScale(16),
  },
  image: {
    width: "100%",
    height: verticalScale(150),
    borderTopLeftRadius: radius._10,
    borderTopRightRadius: radius._10,
  },
  descriptionContainer: {
    marginTop: verticalScale(16),
    paddingHorizontal: scale(10),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX._15,
  },
  ratingContainer: {
    position: "absolute",
    top: 13,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderColor: "white",
    borderRadius: radius._10,
    paddingHorizontal: 8,
    margin: 5,
  },
  preOrderContainer: {
    position: "absolute",
    top: verticalScale(10),
    right: scale(10),
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  preOrderText: {
    borderWidth: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderColor: "white",
    borderRadius: radius._30,
    paddingHorizontal: spacingX._7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderTopLeftRadius: radius._10,
    borderTopRightRadius: radius._10,
    filter: "grayscale(100%)",
  },
});
