import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { commonStyles } from "@/constants/commonStyles";
import { Info } from "phosphor-react-native";
import { pickAndDropVehicleDetail } from "@/utils/defaultData";

interface VehicleCardProps {
  data: VehicleData[];
  onVehicleSelect: (vehicleType: string, deliveryCharges: number) => void;
  onViewVehicle: (data: string) => void;
}

interface VehicleData {
  vehicleType: string;
  deliveryCharges: number;
  distance: number;
  duration: number;
}

const VehicleCard: FC<VehicleCardProps> = ({
  data,
  onVehicleSelect,
  onViewVehicle,
}) => {
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    data?.length && setSelected(data[0]?.vehicleType);
    data?.length &&
      onVehicleSelect(data[0]?.vehicleType, data[0]?.deliveryCharges);
  }, [data]);

  if (!data?.length) {
    return null;
  }

  return (
    <>
      <Typo
        size={14}
        fontFamily="Medium"
        color={colors.NEUTRAL900}
        style={{ paddingBottom: verticalScale(20) }}
      >
        Vehicle Type
      </Typo>

      {data?.map((vehicle) => (
        <Pressable
          onPress={() => {
            setSelected(vehicle.vehicleType);
            onVehicleSelect(vehicle.vehicleType, vehicle.deliveryCharges);
          }}
          key={vehicle.vehicleType}
          style={styles.cardContainer}
        >
          <Image
            source={
              pickAndDropVehicleDetail.find(
                (data) => data.name === vehicle.vehicleType
              )?.image
            }
            style={styles.cardImage}
          />

          <View style={{ flex: 1, marginStart: scale(10) }}>
            <View style={commonStyles.flexRowGap}>
              <Typo size={16} color={colors.NEUTRAL900} fontFamily="Medium">
                {vehicle.vehicleType}
              </Typo>
              <Pressable
                style={{ padding: scale(5) }}
                onPress={() => onViewVehicle(vehicle.vehicleType)}
              >
                <Info size={scale(16)} />
              </Pressable>
            </View>

            <Typo size={12} color={colors.NEUTRAL400}>
              {vehicle.distance} km | {vehicle.duration} min
            </Typo>
          </View>

          <View style={commonStyles.flexRowGap}>
            <View>
              <Typo size={18} fontFamily="SemiBold" color={colors.NEUTRAL900}>
                ₹{vehicle.deliveryCharges.toFixed(2)}
              </Typo>
              {/* <Typo size={12} color={colors.GREEN}>
                Suggested
              </Typo> */}
            </View>

            <View
              style={[
                styles.radio,
                selected === vehicle.vehicleType && styles.radioSelected,
              ]}
            >
              {selected === vehicle.vehicleType && (
                <View style={styles.radioInner} />
              )}
            </View>
          </View>
        </Pressable>
      ))}
    </>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.WHITE,
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(10),
    borderRadius: radius._10,
    elevation: 2,
    marginBottom: verticalScale(20),
  },
  cardImage: {
    width: scale(60),
    height: verticalScale(60),
    resizeMode: "cover",
  },
  radio: {
    width: scale(20),
    height: scale(20),
    borderWidth: 2,
    borderColor: colors.NEUTRAL500,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: scale(5),
  },
  radioSelected: {
    borderColor: colors.NEUTRAL900,
  },
  radioInner: {
    width: scale(10),
    height: scale(10),
    backgroundColor: colors.NEUTRAL900,
    borderRadius: 99,
  },
});
