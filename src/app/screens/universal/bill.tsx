import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import AddTip from "@/components/common/AddTip";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors, radius } from "@/constants/theme";
import PromoCode from "@/components/common/Promocode";
import BillDetail from "@/components/common/BillDetail";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

const Bill = () => {
  return (
    <ScreenWrapper>
      <ScrollView>
        <Header title="Checkout" />

        <AddTip onSelectTip={() => {}} />

        <View style={styles.promoContainer}>
          <PromoCode />
        </View>

        <View style={styles.billContainer}>
          <Typo fontFamily="Medium" size={14} color={colors.NEUTRAL900}>
            Bill Summary
          </Typo>

          <BillDetail />
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: "white",
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "98%",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 30,
          }}
        >
          <View>
            <Typo size={13} style={{ color: "#adb5bd" }}>
              Pay
            </Typo>
            <Pressable
              onPress={() => {}}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 5,
                position: "relative",
              }}
            >
              <Typo
                fontFamily="Medium"
                size={14}
                style={{
                  color: "#343a40",
                  marginRight: 10,
                  minWidth: SCREEN_WIDTH * 0.3,
                }}
              >
                Online
              </Typo>

              {/* <Ionicons
                name={showPaymentOptions ? "chevron-down" : "chevron-up"}
                size={RFValue(16, screenHeight)}
                color="black"
                style={{ borderWidth: 1, padding: 2, borderRadius: 8 }}
              /> */}
            </Pressable>

            {/* {showPaymentOptions && (
              <View
                style={{
                  position: "absolute",
                  top: -150,
                  left: -10,
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  width: screenWidth * 0.5,
                  paddingVertical: 10,
                  zIndex: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  borderRadius: 5,
                }}
              >
                {["Online-payment", "Pay on delivery", "Famto cash"].map(
                  (value) => (
                    <Pressable
                      key={value}
                      style={{ paddingVertical: 10 }}
                      onPress={() => choosePaymentMode(value)}
                    >
                      <CustomText>{value}</CustomText>
                    </Pressable>
                  )
                )}
              </View>
            )} */}
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.PRIMARY,
              flex: 1,
              paddingVertical: verticalScale(10),
              borderRadius: radius._10,
            }}
          >
            <Typo size={14} style={{ textAlign: "center", color: "white" }}>
              Place Order
            </Typo>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Bill;

const styles = StyleSheet.create({
  promoContainer: {
    marginTop: verticalScale(30),
    borderRadius: radius._10,
    marginHorizontal: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  billContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
});
