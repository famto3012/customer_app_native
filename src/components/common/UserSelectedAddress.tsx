import { Pressable, View } from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { CaretRight, House } from "phosphor-react-native";
import Typo from "../Typo";
import { useAuthStore } from "@/store/store";
import { router } from "expo-router";
import { FC, useEffect, useState } from "react";
import { SelectedAddress } from "@/types";
import { useData } from "@/context/DataContext";
import { useShowAlert } from "@/hooks/useShowAlert";

interface UserSelectedAddressProps {
  address?: SelectedAddress;
  deliveryMode: string;
  pick?: boolean;
  drop?: boolean;
  onSelect: (type: string, address: any) => void;
}

const UserSelectedAddress: FC<UserSelectedAddressProps> = ({
  address,
  deliveryMode,
  pick,
  drop,
  onSelect,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
    type: "",
    otherId: "",
    address: "",
  });

  const { pickAddress, dropAddress, setDropAddress, setPickAddress } =
    useData();
  const { showAlert } = useShowAlert();

  useEffect(() => {
    if (!address?.type && !pickAddress.type && !dropAddress.type) return;

    if (deliveryMode === "Pick and Drop") {
      if (pick && pickAddress.type) {
        if (address?.type === "other") {
          if (address.otherId === pickAddress.otherId) {
            showAlert("Pick and drop address cannot be same");
            return;
          }
        } else if (address?.type === pickAddress.type) {
          showAlert("Pick and drop address cannot be same");
          return;
        }

        setSelectedAddress(pickAddress);
        onSelect("pick", pickAddress);
        setPickAddress({ type: "", otherId: "", address: "" });
        return;
      }

      if (drop && dropAddress.type) {
        if (address?.type === "other") {
          if (address.otherId === dropAddress.otherId) {
            showAlert("Pick and drop address cannot be same");
            return;
          }
        } else if (address?.type === dropAddress.type) {
          showAlert("Pick and drop address cannot be same");
          return;
        }

        setSelectedAddress(dropAddress);
        onSelect("drop", dropAddress);
        setDropAddress({ type: "", otherId: "", address: "" });
        return;
      }
    }

    if (deliveryMode !== "Pick and Drop" && dropAddress.type) {
      setSelectedAddress(dropAddress);
      onSelect("drop", dropAddress);
      setDropAddress({ type: "", otherId: "", address: "" });
    }
  }, [pickAddress, dropAddress]);

  const userAddress = useAuthStore((state) => state.userAddress);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(modals)/SelectAddress",
          params: {
            setAsUserAddress: "false",
            showActionButton: "false",
            addressFor: pick ? "pick" : drop ? "drop" : "drop",
          },
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: scale(20),
        marginVertical: verticalScale(20),
        backgroundColor: colors.NEUTRAL200,
        borderRadius: radius._6,
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
      }}
    >
      <House weight="fill" color={colors.NEUTRAL400} />

      {deliveryMode !== "Pick and Drop" ? (
        <View style={{ flex: 1, marginLeft: scale(10) }}>
          {selectedAddress.type && (
            <>
              <Typo size={14} color={colors.NEUTRAL800} fontFamily="Medium">
                Delivery at{" "}
                {selectedAddress?.type?.charAt(0)?.toUpperCase() +
                  selectedAddress?.type?.slice(1)}
              </Typo>
              <Typo size={11} color={colors.NEUTRAL500}>
                {selectedAddress?.address}
              </Typo>
            </>
          )}

          {!selectedAddress.type && userAddress.type && (
            <>
              <Typo size={14} color={colors.NEUTRAL800} fontFamily="Medium">
                Delivery at{" "}
                {userAddress?.type?.charAt(0)?.toUpperCase() +
                  userAddress?.type?.slice(1)}
              </Typo>
              <Typo size={11} color={colors.NEUTRAL500}>
                {userAddress?.address}
              </Typo>
            </>
          )}

          {!userAddress.type && !selectedAddress.type && (
            <Typo size={14} color={colors.NEUTRAL800} fontFamily="SemiBold">
              Select a Delivery address
            </Typo>
          )}
        </View>
      ) : (
        <View style={{ flex: 1, marginLeft: scale(10) }}>
          {selectedAddress?.type ? (
            <>
              <Typo size={12} color={colors.NEUTRAL800} fontFamily="Medium">
                {pick ? "Pick From " : "Delivery To "}
              </Typo>
              <Typo size={14} color={colors.NEUTRAL800} fontFamily="Medium">
                {selectedAddress?.type?.charAt(0)?.toUpperCase() +
                  selectedAddress?.type?.slice(1)}
              </Typo>
              <Typo size={11} color={colors.NEUTRAL500}>
                {selectedAddress?.address}
              </Typo>
            </>
          ) : (
            <Typo size={14} color={colors.NEUTRAL800} fontFamily="SemiBold">
              {pick
                ? "Select a Pick Address"
                : drop
                ? "Select a Drop address"
                : ""}
            </Typo>
          )}
        </View>
      )}

      <CaretRight />
    </Pressable>
  );
};

export default UserSelectedAddress;
