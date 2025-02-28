import { Image, Pressable, StyleSheet, View } from "react-native";
import { FC } from "react";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { CaretRight, XCircle } from "phosphor-react-native";

const SchedulePicker: FC<{
  onPress: () => void;
  value: { startDate: string; endDate: string; time: string };
  onClearSchedule: () => void;
}> = ({ onPress, value, onClearSchedule }) => {
  return (
    <View style={[styles.container]}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <Image
          source={require("@/assets/icons/calendar-edit.webp")}
          style={{ width: scale(24), height: scale(24) }}
          resizeMode="cover"
        />

        <View style={{ flex: 1, marginStart: scale(16) }}>
          <Typo size={14} color={colors.NEUTRAL800}>
            Schedule Order{" "}
            <Typo size={13} color={colors.NEUTRAL400}>
              (Optional)
            </Typo>
          </Typo>
          <Typo size={12} color={colors.NEUTRAL400}>
            Fix a date and time for your order
          </Typo>
        </View>

        <View
          style={{ borderRadius: radius._6, borderWidth: 1, padding: scale(2) }}
        >
          <CaretRight size={scale(16)} />
        </View>
      </Pressable>

      <View
        style={[
          styles.footerContainer,
          { display: value.time ? "flex" : "none" },
        ]}
      >
        {value?.startDate !== value?.endDate && (
          <View style={styles.dateContainer}>
            <Typo
              size={13}
              color={colors.NEUTRAL500}
              textProps={{ numberOfLines: 2 }}
            >
              Order Scheduled from{" "}
              <Typo size={13} fontFamily="Medium" color={colors.NEUTRAL700}>
                {value.startDate} to {value.endDate}, {value.time}
              </Typo>
            </Typo>
          </View>
        )}

        {value?.startDate === value?.endDate && (
          <View style={styles.dateContainer}>
            <Typo
              size={13}
              color={colors.NEUTRAL500}
              textProps={{ numberOfLines: 2 }}
            >
              Order Scheduled on{" "}
              <Typo size={13} fontFamily="Medium" color={colors.NEUTRAL700}>
                {value.startDate}, {value.time}
              </Typo>
            </Typo>
          </View>
        )}

        <Pressable onPress={onClearSchedule} style={{ padding: scale(10) }}>
          <XCircle color={colors.RED} />
        </Pressable>
      </View>
    </View>
  );
};

export default SchedulePicker;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(20),
    flexDirection: "column",
  },
  pressable: {
    backgroundColor: colors.WHITE,
    marginVertical: verticalScale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: radius._10,
    flexDirection: "row",
    alignItems: "center",
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateContainer: {
    flex: 1,
    backgroundColor: colors.NEUTRAL200,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderRadius: radius._6,
  },
});
