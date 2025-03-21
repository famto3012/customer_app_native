import {
  Alert,
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
import { FC, useState, useEffect, useCallback } from "react";

import { DatePickerModal } from "react-native-paper-dates";
import { TimePickerModal } from "react-native-paper-dates";
import { formatDate, formatTime } from "@/utils/helpers";

interface ScheduleSheetProps {
  onPress: (startDate: string, endDate: string, time: string) => void;
  playSound: () => void;
  isPlaying: boolean;
}

const ScheduleSheet: FC<ScheduleSheetProps> = ({
  onPress,
  isPlaying,
  playSound,
}) => {
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [selectedTime, setSelectedTime] = useState<{
    hours: number | null;
    minutes: number | null;
  }>({
    hours: null,
    minutes: null,
  });
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [minimumTime, setMinimumTime] = useState<{
    hours: number;
    minutes: number;
  } | null>(null);

  // Check if a date is today
  const isToday = useCallback((date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  // Calculate and set minimum time constraints
  const updateTimeConstraints = useCallback(() => {
    const now = new Date();
    let currentHours = now.getHours();
    let currentMinutes = now.getMinutes();

    if (isToday(selectedDates.startDate)) {
      // Calculate minimum time (current time + 1.5 hours)
      let minHours = currentHours;
      let minMinutes = currentMinutes + 90; // Add 90 minutes (1.5 hours)

      // Handle minute overflow
      if (minMinutes >= 60) {
        minHours += Math.floor(minMinutes / 60);
        minMinutes = minMinutes % 60;
      }

      // Handle hour overflow
      if (minHours >= 24) {
        minHours = minHours % 24;
      }

      setMinimumTime({ hours: minHours, minutes: minMinutes });

      // Set default time to minimum allowed time
      setHours(minHours);
      setMinutes(minMinutes);

      // Also update selectedTime to match the minimum
      setSelectedTime({
        hours: minHours,
        minutes: minMinutes,
      });
    } else {
      // If not today, no minimum time restriction
      setMinimumTime(null);

      // For future dates, default to noon
      setHours(12);
      setMinutes(0);
    }
  }, [selectedDates.startDate, isToday]);

  // Update time constraints when selected date changes
  useEffect(() => {
    if (selectedDates.startDate) {
      updateTimeConstraints();
    }
  }, [selectedDates.startDate, updateTimeConstraints]);

  // Handle date selection
  const onDateChange = (data: any) => {
    const startDate = new Date(data.startDate);
    let endDate = data.endDate ? new Date(data.endDate) : new Date(startDate);

    // If no endDate is provided or if startDate and endDate are the same, set endDate to startDate + 1 day
    if (!data.endDate || startDate.toDateString() === endDate.toDateString()) {
      endDate.setUTCDate(startDate.getUTCDate() + 1);
      endDate.setUTCHours(18, 29, 59, 999);
    } else {
      // If startDate and endDate are different, set endDate to 18:29:59.999 UTC
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      endDate.setUTCHours(18, 29, 59, 999);
    }

    setSelectedDates({
      startDate: startDate,
      endDate: endDate,
    });

    // Reset selected time when date changes
    setSelectedTime({
      hours: null,
      minutes: null,
    });

    setShowDatePicker(false);
  };

  const isTimeValid = useCallback(
    (hours: number, minutes: number): boolean => {
      if (!isToday(selectedDates.startDate)) {
        return true; // Allow any time if not today
      }

      const now = new Date();

      // Calculate the minimum allowed time (current time + 1.5 hours)
      const minimumSelectableTime = new Date(now.getTime() + 90 * 60000);
      const minHours = minimumSelectableTime.getHours();
      const minMinutes = minimumSelectableTime.getMinutes();

      console.log(`Selected Time: ${hours}:${minutes}`);
      console.log(`Minimum Allowed Time: ${minHours}:${minMinutes}`);

      // Handle time comparison properly, including rollover past midnight
      if (
        (now.getHours() <= minHours &&
          (hours < minHours || (hours === minHours && minutes < minMinutes))) ||
        (now.getHours() > minHours && hours < minHours)
      ) {
        alert("Selected time must be at least 1 hour 30 minutes ahead.");
        return false;
      }

      return true;
    },
    [selectedDates.startDate]
  );

  // Handle time selection
  const onTimeChange = (data: any) => {
    if (!isTimeValid(data.hours, data.minutes)) {
      Alert.alert(
        "Invalid Time",
        `Please select a time at least 1.5 hours from now (${formatTimeForDisplay(
          minimumTime?.hours || 0,
          minimumTime?.minutes || 0
        )} or later).`
      );
      return; // Don't update the selected time
    }

    setSelectedTime({
      hours: data.hours,
      minutes: data.minutes,
    });
    setShowTimePicker(false);
  };

  // Handle schedule button press
  const handleSchedule = () => {
    if (!selectedDates.startDate || !selectedDates.endDate) {
      Alert.alert(
        "Warning",
        "Please select a date / date range for your order"
      );
      return;
    }

    if (!selectedTime.hours || !selectedTime.minutes) {
      Alert.alert("Warning", "Please select a time for your order");
      return;
    }

    // Double-check if selected time is valid
    if (!isTimeValid(selectedTime.hours, selectedTime.minutes)) {
      Alert.alert(
        "Invalid Time",
        `Please select a time at least 1.5 hours from now (${formatTimeForDisplay(
          minimumTime?.hours || 0,
          minimumTime?.minutes || 0
        )} or later).`
      );
      return;
    }

    const start = formatDate(selectedDates.startDate);
    const end = formatDate(selectedDates.endDate);
    const time = formatTime(selectedTime.hours, selectedTime.minutes);

    onPress(start, end, time);
  };

  // Helper function to format time for display
  const formatTimeForDisplay = (hours: number, minutes: number) => {
    return `${hours == 0 ? "00" : hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  // Open time picker with validation
  const openTimePicker = () => {
    if (!selectedDates.startDate) {
      Alert.alert("Warning", "Please select a date first");
      return;
    }

    // Ensure default time is valid
    if (isToday(selectedDates.startDate) && minimumTime) {
      setHours(minimumTime.hours);
      setMinutes(minimumTime.minutes);
    }

    setShowTimePicker(true);
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

          <TouchableOpacity onPress={playSound}>
            <Image
              source={
                isPlaying
                  ? require("@/assets/icons/volume-slash.webp")
                  : require("@/assets/icons/volume-high.webp")
              }
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

        <Pressable onPress={openTimePicker} style={styles.selectionContainer}>
          <Typo size={14}>
            {selectedTime.hours !== null && selectedTime.minutes !== null
              ? formatTimeForDisplay(selectedTime.hours, selectedTime.minutes)
              : "Select Time"}
          </Typo>
          <Clock />
        </Pressable>

        {isToday(selectedDates.startDate) && minimumTime && (
          <Typo
            size={12}
            style={{ paddingTop: verticalScale(5), color: colors.RED }}
          >
            For today, you can only select times after{" "}
            {formatTimeForDisplay(minimumTime.hours, minimumTime.minutes)}
          </Typo>
        )}

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
        <TouchableOpacity
          onPress={handleSchedule}
          style={styles.scheduleButton}
        >
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
