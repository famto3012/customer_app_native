import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors } from "@/constants/theme";
import { FC, useEffect, useState } from "react";
import { MapPinPlus } from "phosphor-react-native";
import { router } from "expo-router";
import { AddressProps } from "@/types";
import { fetchUserAddress } from "@/service/userService";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { commonStyles } from "@/constants/commonStyles";

const Address: FC<{
  alreadySelect?: boolean;
  onSelect?: (type: string, otherId?: string, address?: string) => void;
  showActionButton?: boolean;
  addressType?: string;
  addressOtherId?: string;
  selectedAddress?: (type: string, otherId?: string, address?: string) => void;
}> = ({
  onSelect,
  alreadySelect = false,
  showActionButton = false,
  addressType,
  addressOtherId,
  selectedAddress,
}) => {
  const [selected, setSelected] = useState<string>("");
  const [selectedOtherId, setSelectedOtherId] = useState<string>("");

  const [home, setHome] = useState<AddressProps | null>(null);
  const [work, setWork] = useState<AddressProps | null>(null);
  const [other, setOther] = useState<AddressProps[]>([]);

  const { token, userAddress } = useAuthStore.getState();

  const { data } = useQuery({
    queryKey: ["customer-address"],
    queryFn: () => fetchUserAddress(),
    enabled: !!token,
  });

  useEffect(() => {
    if (data) {
      setHome(data?.homeAddress || null);
      setWork(data?.workAddress || null);
      setOther(data?.otherAddress || []);
    }

    if (alreadySelect) {
      setSelected(userAddress.type);
      setSelectedOtherId(userAddress.otherId);
      if (selectedAddress) {
        selectedAddress(
          userAddress.type,
          userAddress.otherId,
          userAddress.address
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (selected === "other") {
      setSelectedOtherId(other[0]?.id);
    } else {
      setSelectedOtherId("");
    }
  }, [selected]);

  const handleSelectAddress = (type: string, address?: string) => {
    setSelected(type);

    type === "other"
      ? setSelectedOtherId(other[0]?.id)
      : setSelectedOtherId("");

    if (onSelect) {
      type === "other"
        ? onSelect(type, other[0]?.id, address)
        : onSelect(type, "", address);
    }
  };

  const renderAddress = (address: AddressProps | null) => {
    return (
      <View
        style={{
          marginTop: 15,
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          borderColor: colors.PRIMARY,
          backgroundColor: "#E5FAFA",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ width: "90%" }}>
          <Typo
            size={14}
            color={colors.NEUTRAL900}
            fontFamily="Medium"
            style={{ paddingBottom: verticalScale(3) }}
          >
            {address?.fullName}
          </Typo>
          <Typo
            size={13}
            color={colors.NEUTRAL900}
            style={{ paddingBottom: verticalScale(5) }}
          >
            {address?.phoneNumber}
          </Typo>
          <Typo size={12} color={colors.NEUTRAL500} style={{ width: "70%" }}>
            {address?.flat}, {address?.area}, {address?.landmark}
          </Typo>
        </View>

        {showActionButton && (
          <Pressable
            style={{ padding: scale(3) }}
            onPress={() => {
              router.push({
                pathname: "/screens/common/EditAddress",
                params: {
                  address: JSON.stringify(address),
                  addressType: selected,
                },
              });
            }}
          >
            <Image
              source={require("@/assets/icons/edit.webp")}
              style={{
                width: scale(24),
                height: verticalScale(24),
                resizeMode: "cover",
              }}
            />
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabOptionContainer}>
        <TouchableOpacity
          onPress={() =>
            handleSelectAddress(
              "home",
              `${home?.flat}, ${home?.area}, ${home?.landmark}`
            )
          }
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "home" ? colors.PRIMARY : colors.NEUTRAL200,
            },
          ]}
          disabled={!home?.fullName}
        >
          <Typo
            size={13}
            fontFamily="Medium"
            color={
              !home?.fullName
                ? colors.NEUTRAL400
                : selected === "home"
                ? colors.WHITE
                : colors.NEUTRAL600
            }
          >
            Home
          </Typo>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            handleSelectAddress(
              "work",
              `${work?.flat}, ${work?.area}, ${work?.landmark}`
            )
          }
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "work" ? colors.PRIMARY : colors.NEUTRAL200,
            },
          ]}
          disabled={!work?.fullName}
        >
          <Typo
            size={13}
            fontFamily="Medium"
            color={
              !work?.fullName
                ? colors.NEUTRAL400
                : selected === "work"
                ? colors.WHITE
                : colors.NEUTRAL600
            }
          >
            Work
          </Typo>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            handleSelectAddress(
              "other",
              `${other[0]?.flat}, ${other[0]?.area}, ${other[0]?.landmark}`
            )
          }
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "other" ? colors.PRIMARY : colors.NEUTRAL200,
            },
          ]}
          disabled={!other?.length}
        >
          <Typo
            size={13}
            fontFamily="Medium"
            color={
              !other?.length
                ? colors.NEUTRAL400
                : selected === "other"
                ? colors.WHITE
                : colors.NEUTRAL600
            }
          >
            Others
          </Typo>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/screens/common/add-address")}
          style={styles.addOption}
        >
          <MapPinPlus size={20} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {selected === "home" && renderAddress(home)}

      {selected === "work" && renderAddress(work)}

      {selected === "other" && (
        <FlatList
          data={other}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedOtherId(item.id);
                if (onSelect) {
                  onSelect(
                    "other",
                    item.id,
                    `${item.flat}, ${item.area}, ${item.landmark}`
                  );
                }
              }}
              style={[
                commonStyles.flexRowBetween,
                {
                  marginTop: 15,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 5,
                  borderColor:
                    selectedOtherId === item.id
                      ? colors.PRIMARY
                      : colors.NEUTRAL300,
                  backgroundColor:
                    selectedOtherId === item.id ? "#E5FAFA" : "transparent",
                },
              ]}
            >
              <View style={{ width: "90%" }}>
                <Typo
                  size={14}
                  color={colors.NEUTRAL900}
                  fontFamily="Medium"
                  style={{ paddingBottom: verticalScale(3) }}
                >
                  {item?.fullName}
                </Typo>
                <Typo
                  size={13}
                  color={colors.NEUTRAL900}
                  style={{ paddingBottom: verticalScale(5) }}
                >
                  {item?.phoneNumber}
                </Typo>
                <Typo size={12} color={colors.NEUTRAL500}>
                  {item?.flat}, {item?.area}, {item?.landmark}
                </Typo>
              </View>

              {showActionButton && (
                <Pressable
                  style={{ padding: scale(3) }}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/common/EditAddress",
                      params: {
                        address: JSON.stringify(item),
                        addressType: "other",
                      },
                    })
                  }
                >
                  <Image
                    source={require("@/assets/icons/edit.webp")}
                    style={{
                      width: scale(24),
                      height: verticalScale(24),
                      resizeMode: "cover",
                    }}
                  />
                </Pressable>
              )}
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={alreadySelect}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  tabOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  tabOption: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    height: 40,
  },
  addOption: {
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.PRIMARY_LIGHT,
    height: 40,
    borderRadius: 5,
  },
});
