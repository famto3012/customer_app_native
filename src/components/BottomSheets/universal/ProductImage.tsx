import { Image, View } from "react-native";
import { useData } from "@/context/DataContext";
import { scale, SCREEN_WIDTH } from "@/utils/styling";

const ProductImage = () => {
  const { product } = useData();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src={product?.productImageURL}
        style={{ width: SCREEN_WIDTH - scale(50), height: "100%" }}
        resizeMode="contain"
      />
    </View>
  );
};

export default ProductImage;
