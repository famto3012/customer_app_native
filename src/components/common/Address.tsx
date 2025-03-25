import {
  ActivityIndicator,
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
import { UserAddressProps } from "@/types";
import { fetchUserAddress, updateUserAddress } from "@/service/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/store";
import { commonStyles } from "@/constants/commonStyles";

const Address: FC<{
  alreadySelect?: boolean;
  onSelect?: (
    type: string,
    otherId?: string,
    address?: string,
    coordinates?: number[]
  ) => boolean | void;
  showActionButton?: boolean;
  addressType?: string;
  addressOtherId?: string;
  selectedAddress?: (
    type: string,
    otherId?: string,
    address?: string,
    coordinates?: number[]
  ) => void;
  validateSelection?: boolean;
}> = ({
  onSelect,
  alreadySelect = false,
  showActionButton = false,
  addressType,
  addressOtherId,
  selectedAddress,
  validateSelection = false,
}) => {
  const [selected, setSelected] = useState<string>("");
  const [selectedOtherId, setSelectedOtherId] = useState<string>("");
  const [selectionValid, setSelectionValid] = useState<boolean>(true);
  const [addressToDelete, setAddressToDelete] = useState<{
    type: string;
    otherId: string;
  }>({ type: "", otherId: "" });

  const [home, setHome] = useState<UserAddressProps | null>(null);
  const [work, setWork] = useState<UserAddressProps | null>(null);
  const [other, setOther] = useState<UserAddressProps[]>([]);

  const { token, userAddress } = useAuthStore.getState();
  const queryClient = useQueryClient();

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

      let coordinates = null;

      if (userAddress.type === "home") {
        coordinates = data?.homeAddress?.coordinates;
      } else if (userAddress?.type === "work") {
        coordinates = data.workAddress?.coordinates;
      } else if (userAddress.type === "other") {
        // Find the specific other address by ID
        const otherAddress = data?.otherAddress.find(
          (addr: any) => addr?.id === userAddress?.otherId
        );
        coordinates = otherAddress?.coordinates;
      }
      if (selectedAddress) {
        selectedAddress(
          userAddress.type,
          userAddress.otherId,
          userAddress.address,
          coordinates
        );
      }
    }
  }, [data]);

  // Update selected value when addressType changes externally
  useEffect(() => {
    if (addressType !== undefined) {
      setSelected(addressType);
    }
  }, [addressType]);

  // Update selectedOtherId when addressOtherId changes externally
  useEffect(() => {
    if (addressOtherId !== undefined) {
      setSelectedOtherId(addressOtherId);
    }
  }, [addressOtherId]);

  const handleSelectAddress = (
    type: string,
    otherId?: string,
    address?: string,
    coordinates?: number[]
  ) => {
    // If validateSelection prop is true, call onSelect and check the return value
    if (validateSelection && onSelect) {
      const isValid = onSelect(type, otherId, address, coordinates);

      // If onSelect returns false, don't update local state
      if (isValid === false) {
        setSelectionValid(false);
        return;
      }
    } else if (onSelect) {
      // If validateSelection is false, just call onSelect
      onSelect(type, otherId, address, coordinates);
    }

    setSelectionValid(true);
    setSelected(type);

    if (type === "other") {
      // Only set selectedOtherId if explicitly provided
      setSelectedOtherId(otherId || "");
    } else {
      setSelectedOtherId("");
    }
  };

  const handleDeleteAddressMutation = useMutation({
    mutationKey: ["update-address"],
    mutationFn: (data: UserAddressProps) => updateUserAddress(data),
    onSuccess: (data) => {
      if (data.success && !data.address) {
        if (
          addressToDelete.type === useAuthStore.getState().userAddress.type &&
          !addressToDelete.otherId
        ) {
          useAuthStore.setState({
            userAddress: {
              type: "",
              otherId: "",
              address: "",
            },
          });

          setAddressToDelete({ type: "", otherId: "" });
        } else if (
          addressToDelete.otherId ===
          useAuthStore.getState().userAddress.otherId
        ) {
          useAuthStore.setState({
            userAddress: {
              type: "",
              otherId: "",
              address: "",
            },
          });

          setAddressToDelete({ type: "", otherId: "" });
        }

        queryClient.invalidateQueries({ queryKey: ["customer-address"] });
      }
    },
  });

  const handleDelete = (type: string, id?: string) => {
    const address = {
      id: id ?? "",
      type,
      fullName: null,
      phoneNumber: null,
      flat: null,
      area: null,
      coordinates: null,
    };

    setAddressToDelete({ type, otherId: id || "" });

    handleDeleteAddressMutation.mutate(address);
  };

  const renderAddress = (address: UserAddressProps | null) => {
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
        <View style={{ width: "100%" }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View>
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
            </View>

            {showActionButton && (
              <View style={[commonStyles.flexRowGap]}>
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

                {handleDeleteAddressMutation.isPending &&
                addressToDelete.type === address?.type &&
                addressToDelete.type !== "other" ? (
                  <ActivityIndicator size="small" color={colors.RED} />
                ) : (
                  <Pressable
                    style={{ padding: scale(3) }}
                    onPress={() => handleDelete(address?.type || "")}
                  >
                    <Image
                      source={require("@/assets/icons/trash.webp")}
                      style={{
                        width: scale(24),
                        height: verticalScale(24),
                        resizeMode: "cover",
                      }}
                    />
                  </Pressable>
                )}
              </View>
            )}
          </View>

          <View>
            <Typo size={12} color={colors.NEUTRAL500} style={{ width: "75%" }}>
              {address?.flat}, {address?.area}, {address?.landmark}
            </Typo>
          </View>
        </View>
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
              "",
              `${home?.flat}, ${home?.area}, ${home?.landmark}`,
              home?.coordinates
            )
          }
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "home" && selectionValid
                  ? colors.PRIMARY
                  : colors.NEUTRAL200,
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
                : selected === "home" && selectionValid
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
              "",
              `${work?.flat}, ${work?.area}, ${work?.landmark}`,
              work?.coordinates
            )
          }
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "work" && selectionValid
                  ? colors.PRIMARY
                  : colors.NEUTRAL200,
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
                : selected === "work" && selectionValid
                ? colors.WHITE
                : colors.NEUTRAL600
            }
          >
            Work
          </Typo>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // Don't automatically select the first address for "Other" type
            // Just set the type to "other" and let the user select a specific address
            handleSelectAddress("other", "", "");
          }}
          style={[
            styles.tabOption,
            {
              backgroundColor:
                selected === "other" && selectionValid
                  ? colors.PRIMARY
                  : colors.NEUTRAL200,
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
                : selected === "other" && selectionValid
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

      {selected === "home" && selectionValid && renderAddress(home)}

      {selected === "work" && selectionValid && renderAddress(work)}

      {selected === "other" && selectionValid && (
        <FlatList
          data={other}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                handleSelectAddress(
                  "other",
                  item.id,
                  `${item.flat}, ${item.area}, ${item.landmark}`,
                  item.coordinates
                );
              }}
              style={[
                commonStyles.flexRowBetween,
                {
                  marginTop: 15,
                  marginBottom: scale(10),
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
              <View style={{ width: "100%" }}>
                <View style={[commonStyles.flexRowBetween]}>
                  <View>
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
                  </View>

                  {showActionButton && (
                    <View style={[commonStyles.flexRowGap]}>
                      <Pressable
                        style={{ padding: scale(3) }}
                        onPress={() => {
                          router.push({
                            pathname: "/screens/common/EditAddress",
                            params: {
                              address: JSON.stringify(item),
                              addressType: "other",
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

                      {handleDeleteAddressMutation.isPending &&
                      addressToDelete.type === "other" &&
                      addressToDelete.otherId === item.id ? (
                        <ActivityIndicator size="small" color={colors.RED} />
                      ) : (
                        <Pressable
                          style={{ padding: scale(3) }}
                          onPress={() =>
                            handleDelete(item?.type || "", item.id)
                          }
                        >
                          <Image
                            source={require("@/assets/icons/trash.webp")}
                            style={{
                              width: scale(24),
                              height: verticalScale(24),
                              resizeMode: "cover",
                            }}
                          />
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>

                <View>
                  <Typo
                    size={12}
                    color={colors.NEUTRAL500}
                    style={{ width: "90%" }}
                  >
                    {item?.flat}, {item?.area}, {item?.landmark}
                  </Typo>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          scrollEnabled={true}
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
