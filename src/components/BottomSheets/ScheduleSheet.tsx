import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheetScrollView, SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { scale, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { Clock } from "phosphor-react-native";
import { scheduleDetails } from "@/utils/defaultData";
import { useState } from "react";

import { DatePickerModal } from "react-native-paper-dates";
import { TimePickerModal } from "react-native-paper-dates";

const ScheduleSheet = () => {
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [selectedTime, setSelectedTime] = useState<{
    hours: Number | null;
    minutes: Number | null;
  }>({
    hours: null,
    minutes: null,
  });
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const getDefaultTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    if (
      selectedDates.startDate &&
      selectedDates.endDate &&
      selectedDates.startDate?.toDateString() ===
        selectedDates.endDate?.toDateString()
    ) {
      hours += 1; // Set 1 hour after current time
      if (hours >= 24) {
        hours = 1;
      }
    }

    setHours(hours);
    setMinutes(minutes);
    // return { hours, minutes };
  };

  const onDateChange = (data: any) => {
    console.log("Date selected:", data);

    const startDate = new Date(data.startDate);
    let endDate = data.endDate ? new Date(data.endDate) : new Date(startDate);

    // If no endDate is provided or if startDate and endDate are the same, set endDate to startDate + 1 day
    if (!data.endDate || startDate.toDateString() === endDate.toDateString()) {
      endDate.setUTCDate(startDate.getUTCDate() + 1);
      endDate.setUTCHours(18, 29, 59, 999);
    } else {
      // If startDate and endDate are different, set endDate to 18:29:59.999 UTC (which is 23:59:59.999 IST)
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      endDate.setUTCHours(18, 29, 59, 999);
    }

    console.log("Final EndDate:", endDate);
    console.log("StartDate:", startDate);

    setSelectedDates({
      startDate: startDate,
      endDate: endDate,
    });

    setShowDatePicker(false);
    getDefaultTime();
  };

  const onTimeChange = (data: any) => {
    console.log("Time selected:", data);
    setSelectedTime({
      hours: data.hours,
      minutes: data.minutes,
    });
    setShowTimePicker(false);
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
          onPress={() => setShowDatePicker(true)}
          style={styles.selectionContainer}
        >
          <Typo size={14}>
            {selectedDates.startDate
              ? `${selectedDates.startDate.toDateString()}${
                  selectedDates.endDate
                    ? " - " + selectedDates.endDate.toDateString()
                    : ""
                }`
              : "Select Date"}
          </Typo>
          <Image
            source={require("@/assets/icons/calendar.webp")}
            style={{ width: scale(24), height: scale(24) }}
            resizeMode="cover"
          />
        </Pressable>

        <DatePickerModal
          locale="en"
          mode="range"
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          presentationStyle="pageSheet"
          animationType="fade"
          validRange={{
            startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
          }}
          startDate={selectedDates.startDate || new Date()}
          endDate={selectedDates.endDate || new Date()}
          onConfirm={onDateChange}
        />

        {/* Time Picker */}
        <Typo
          size={14}
          style={{ paddingTop: verticalScale(20) }}
          color={colors.NEUTRAL800}
          fontFamily="Medium"
        >
          Select Time
        </Typo>

        <Pressable
          onPress={() => {
            setShowTimePicker(true);
          }}
          style={styles.selectionContainer}
        >
          <Typo size={14}>
            {" "}
            {selectedTime.hours !== null && selectedTime.hours !== undefined
              ? `${selectedTime.hours} : ${selectedTime.minutes ?? "00"}`
              : "Select Time"}
          </Typo>
          <Clock />
        </Pressable>

        <TimePickerModal
          visible={showTimePicker}
          onDismiss={() => setShowTimePicker(false)}
          onConfirm={onTimeChange}
          hours={hours}
          minutes={minutes}
        />

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
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9, // Keep it responsive
    backgroundColor: colors.WHITE, // Use white or theme color
    borderRadius: 10,
    padding: 20,
    height: SCREEN_HEIGHT * 0.4, // Adjust height if needed
    // alignSelf: "center", // Ensures it's centered in modal
    marginTop: 10, // Adds space from the top
    // marginLeft: SCREEN_HEIGHT * 0.023, // Adds space from the left
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  toggleButton: {
    marginTop: verticalScale(10),
    backgroundColor: colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
