import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { Clock } from "phosphor-react-native";
import { scheduleDetails } from "@/utils/defaultData";
import { useState } from "react";
import CalendarPicker from "react-native-calendar-picker";

const ScheduleSheet = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const onDateChange = (date: Date, type: string) => {
    if (type === "START_DATE") {
      setStartDate(date);
      setEndDate(date); // Reset end date when a new start date is selected
    } else if (type === "END_DATE" && date >= startDate!) {
      setEndDate(date);
    } else if (!startDate) {
      setStartDate(date); // For single date selection, set as start date
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BottomSheetScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typo size={15} fontFamily="SemiBold" color={colors.NEUTRAL800}>
            Schedule Order
          </Typo>

          <TouchableOpacity>
            <Image
              source={require("@/assets/icons/volume-high.webp")}
              style={{ width: scale(24), height: scale(24) }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <Typo size={12} style={{ paddingTop: verticalScale(20) }}>
          You can select a day or date range on which you need the product to be
          delivered.
        </Typo>

        {/* Date Picker */}
        <Typo
          size={14}
          style={{ paddingTop: verticalScale(20) }}
          color={colors.NEUTRAL800}
          fontFamily="Medium"
        >
          Select Date or Date Range
        </Typo>

        <Pressable
          onPress={() => setShow(true)}
          style={styles.selectionContainer}
        >
          <Typo size={14}>Date</Typo>
          <Image
            source={require("@/assets/icons/calendar.webp")}
            style={{ width: scale(24), height: scale(24) }}
            resizeMode="cover"
          />
        </Pressable>

        {/* Time Picker */}
        <Typo
          size={14}
          style={{ paddingTop: verticalScale(20) }}
          color={colors.NEUTRAL800}
          fontFamily="Medium"
        >
          Select Time
        </Typo>

        <Pressable onPress={() => {}} style={styles.selectionContainer}>
          <Typo size={14}>Time</Typo>
          <Clock />
        </Pressable>

        {/* Schedule Details */}
        <View style={styles.detailsContainer}>
          {scheduleDetails?.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Typo>•</Typo>
              <Typo size={12}>{detail}</Typo>
            </View>
          ))}
        </View>
      </BottomSheetScrollView>

      {/* Schedule Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.scheduleButton}>
          <Typo size={14} color={colors.WHITE}>
            Schedule
          </Typo>
        </TouchableOpacity>
      </View>

      <Modal
        visible={show}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShow(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShow(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <CalendarPicker
                  allowRangeSelection
                  allowBackwardRangeSelect
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={onDateChange}
                  minDate={new Date()}
                  selectedDayStyle={styles.selectedDayStyle}
                  selectedDayColor={colors.PRIMARY}
                  width={SCREEN_WIDTH - 70}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ScheduleSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(15),
    borderBottomWidth: 1,
    paddingBottom: verticalScale(11),
    borderBottomColor: colors.NEUTRAL200,
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    borderRadius: radius._10,
    borderColor: colors.NEUTRAL300,
    marginTop: verticalScale(16),
  },
  detailsContainer: {
    backgroundColor: colors.NEUTRAL100,
    padding: scale(15),
    marginVertical: verticalScale(20),
    borderRadius: radius._10,
  },
  detailItem: {
    flexDirection: "row",
    gap: spacingX._10,
    alignItems: "flex-start",
    paddingBottom: verticalScale(15),
  },
  buttonContainer: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
  },
  scheduleButton: {
    backgroundColor: colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: radius._20,
    width: "90%",
  },
  selectedDayStyle: {
    backgroundColor: colors.PRIMARY,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%", // Prevent overflowing
  },
});
