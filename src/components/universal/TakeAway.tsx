import { StyleSheet, View } from "react-native";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ItemList from "./ItemList";
import Instructions from "../common/Instructions";
import { CartProps } from "@/types";
import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMerchantData } from "@/service/universal";

interface TakeAwayProps {
  items: Pick<CartProps, "items">["items"];
  merchantId: Pick<CartProps, "merchantId">["merchantId"];
  onMerchantVoice: (data: string) => void;
  onMerchantInstruction: (data: string) => void;
}

const TakeAway: FC<TakeAwayProps> = ({
  items,
  merchantId,
  onMerchantVoice,
  onMerchantInstruction,
}) => {
  const { data: merchantData } = useQuery({
    queryKey: ["merchant-data", merchantId],
    queryFn: () => getMerchantData(merchantId),
  });

  return (
    <>
      <View style={styles.addressContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL800}>
              {merchantData?.merchantName}
            </Typo>
            <Typo size={13} color={colors.NEUTRAL800}>
              {merchantData?.phoneNumber}
            </Typo>
          </View>

          <View
            style={{
              backgroundColor: colors.PRIMARY,
              paddingVertical: verticalScale(5),
              paddingHorizontal: scale(10),
              borderRadius: radius._30,
            }}
          >
            <Typo size={13} color={colors.WHITE}>
              Collect from
            </Typo>
          </View>
        </View>

        <View>
          <Typo size={12} style={{ paddingTop: verticalScale(10) }}>
            {merchantData?.displayAddress}
          </Typo>
        </View>
      </View>

      <ItemList items={items} />

      <Instructions
        placeholder="Instruction to merchant"
        onRecordComplete={(data) => onMerchantVoice(data)}
        onChangeText={(data) => onMerchantInstruction(data)}
      />
    </>
  );
};

export default TakeAway;

const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: colors.PRIMARY_LIGHT,
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    padding: scale(10),
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    borderRadius: radius._6,
  },
});
