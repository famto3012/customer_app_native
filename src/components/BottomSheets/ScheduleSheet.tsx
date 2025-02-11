import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius, spacingX } from "@/constants/theme";
import { Clock } from "phosphor-react-native";
import { scheduleDetails } from "@/utils/defaultData";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const ScheduleSheet = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [formattedDate, setFormattedDate] = useState("DD/MM/YYYY");
  const [formattedTime, setFormattedTime] = useState("HH:MM");

  const showDateTimePicker = (currentMode: "date" | "time") => {
    setMode(currentMode);
    setShowPicker(true);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setShowPicker(false);

      if (mode === "date") {
        setDate(selectedDate);
        setFormattedDate(
          selectedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        );
        showDateTimePicker("time"); // Open time picker after date selection
      } else if (mode === "time") {
        setFormattedTime(
          selectedDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    } else {
      setShowPicker(false);
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
          onPress={() => showDateTimePicker("date")}
          style={styles.selectionContainer}
        >
          <Typo size={14}>{formattedDate}</Typo>
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

        <Pressable
          onPress={() => showDateTimePicker("time")}
          style={styles.selectionContainer}
        >
          <Typo size={14}>{formattedTime}</Typo>
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

      {/* Date & Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={date}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}
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
});
