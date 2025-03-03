import { View, Pressable, TextInput } from "react-native";
import { FC, useEffect, useState } from "react";
import Typo from "../Typo";
import { colors, spacingX } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";

interface AddTipProps {
  previousTip: number;
  onTipSelect: (data: number) => void;
}

const AddTip: FC<AddTipProps> = ({ previousTip, onTipSelect }) => {
  const [toggleInput, setToggleInput] = useState<boolean>(false);
  const [customTip, setCustomTip] = useState<string>("");
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  useEffect(() => {
    if (previousTip === 10 || previousTip === 20 || previousTip === 50) {
      setSelectedTip(previousTip);
      setCustomTip("");
    } else if (previousTip > 0) {
      setSelectedTip(previousTip);
      setCustomTip(previousTip.toString());
      setToggleInput(true);
    }
  }, [previousTip]);

  const chooseTip = (value: number) => {
    if (value === selectedTip) {
      setSelectedTip(null);
      setCustomTip("");
      onTipSelect(0);
      return;
    }

    setToggleInput(false);
    setCustomTip("");
    setSelectedTip(value);
    onTipSelect(value);
  };

  return (
    <View style={{ marginTop: 20, paddingHorizontal: scale(20) }}>
      <Typo fontFamily="Medium" size={14} color={colors.NEUTRAL900}>
        Added Tip
      </Typo>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: spacingX._10,
          marginTop: verticalScale(15),
        }}
      >
        {[10, 20, 50]?.map((value, index) => (
          <Pressable
            key={index}
            style={{
              backgroundColor:
                selectedTip === value ? colors.PRIMARY : colors.NEUTRAL200,
              flex: 1,
              padding: 10,
              alignItems: "center",
              borderRadius: 5,
            }}
            onPress={() => chooseTip(value)}
          >
            <Typo
              size={12}
              style={{ color: selectedTip === value ? "white" : "#333" }}
            >
              ₹ {value}
            </Typo>
          </Pressable>
        ))}

        {toggleInput ? (
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.PRIMARY,
              padding: 5,
              borderRadius: 5,
              color: colors.PRIMARY,
              textAlign: "center",
              height: 40,
            }}
            keyboardType="numeric"
            value={customTip}
            maxLength={3}
            onChangeText={setCustomTip}
            onSubmitEditing={() => {
              const value = parseFloat(customTip);
              if (!isNaN(value) && value > 0) {
                setSelectedTip(value);
                onTipSelect(value);
              } else if (customTip === "") {
                onTipSelect(0);
                setSelectedTip(null);
                setCustomTip("");
                setToggleInput(false);
              }
            }}
          />
        ) : (
          <Pressable
            style={{
              backgroundColor: toggleInput ? colors.PRIMARY : colors.NEUTRAL200,
              flex: 1,
              padding: 10,
              alignItems: "center",
              borderRadius: 5,
            }}
            onPress={() => {
              setSelectedTip(null);
              setToggleInput(true);
            }}
          >
            <Typo
              size={12}
              style={{ color: toggleInput ? colors.PRIMARY : "#333" }}
            >
              Other
            </Typo>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default AddTip;
