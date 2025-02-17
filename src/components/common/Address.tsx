import {
  FlatList,
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

const Address: FC<{ onSelect?: (type: string, otherId?: string) => void }> = ({
  onSelect,
}) => {
  const [selected, setSelected] = useState<string>("home");
  const [selectedOtherId, setSelectedOtherId] = useState<string>("");
  const [home, setHome] = useState<AddressProps | null>(null);
  const [work, setWork] = useState<AddressProps | null>(null);
  const [other, setOther] = useState<AddressProps[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer-address"],
    queryFn: () => fetchUserAddress(),
  });

  useEffect(() => {
    setHome(data?.homeAddress || null);
    setWork(data?.workAddress || null);
    setOther(data?.otherAddress || []);
  }, [data]);

  useEffect(() => {
    if (selected === "other") {
      setSelectedOtherId(other[0]?.id);
    } else {
      setSelectedOtherId("");
    }
  }, [selected]);

  const handleSelectAddress = (type: string) => {
    setSelected(type);

    type === "other"
      ? setSelectedOtherId(other[0]?.id)
      : setSelectedOtherId("");

    if (onSelect) {
      type === "other" ? onSelect(type, other[0]?.id) : onSelect(type, "");
    }
  };

  const renderAddress = (address: AddressProps | null) => {
    if (!address) {
      return (
        <View
          style={{
            marginTop: 15,
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            borderColor: colors.NEUTRAL200,
            backgroundColor: colors.NEUTRAL200,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typo size={14} color={colors.NEUTRAL900} fontFamily="Medium">
            No address available
          </Typo>
        </View>
      );
    }

    return (
      <View
        style={{
          marginTop: 15,
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          borderColor: colors.PRIMARY,
          backgroundColor: "#E5FAFA",
        }}
      >
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
        <Typo size={12} color={colors.NEUTRAL500}>
          {address?.flat}, {address?.area}, {address?.landmark}
        </Typo>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabOptionContainer}>
        <TouchableOpacity
          onPress={() => handleSelectAddress("home")}
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "home" ? colors.PRIMARY : colors.NEUTRAL200,
            },
          ]}
        >
          <Typo
            size={13}
            fontFamily="Medium"
            color={selected === "home" ? colors.WHITE : colors.NEUTRAL600}
          >
            Home
          </Typo>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectAddress("work")}
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "work" ? colors.PRIMARY : colors.NEUTRAL200,
            },
          ]}
        >
          <Typo
            size={13}
            fontFamily="Medium"
            color={selected === "work" ? colors.WHITE : colors.NEUTRAL600}
          >
            Work
          </Typo>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectAddress("other")}
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "other" ? colors.PRIMARY : colors.NEUTRAL200,
            },
          ]}
        >
          <Typo
            size={13}
            fontFamily="Medium"
            color={selected === "other" ? colors.WHITE : colors.NEUTRAL600}
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
                  onSelect("other", item.id);
                }
              }}
              style={{
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
              }}
            >
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
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
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
