import { Image, Pressable, ScrollView, View } from "react-native";
import { FC, useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserAddress,
  setGeofenceForUser,
  updateUserAddress,
} from "@/service/userService";
import { useAuthStore } from "@/store/store";
import { UserAddressProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { commonStyles } from "@/constants/commonStyles";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { router } from "expo-router";
import Button from "@/components/Button";
import { MapPin } from "phosphor-react-native";
import AddressLoader from "@/components/Loader/AddressLoader";
import { useData } from "@/context/DataContext";

interface NewAddressUIProps {
  showActionButton?: boolean;
  setAsUserAddress?: boolean;
  addressFor?: "pick" | "drop";
}

const UserSavedAddress: FC<NewAddressUIProps> = ({
  showActionButton = true,
  setAsUserAddress,
  addressFor,
}) => {
  const [home, setHome] = useState<UserAddressProps | null>(null);
  const [work, setWork] = useState<UserAddressProps | null>(null);
  const [other, setOther] = useState<UserAddressProps[]>([]);

  const { setPickAddress, setDropAddress } = useData();
  const { token } = useAuthStore.getState();
  const queryClient = useQueryClient();
  const userSelectedAddress = useAuthStore((state) => state.userAddress);

  const { data, isLoading } = useQuery({
    queryKey: ["customer-address"],
    queryFn: fetchUserAddress,
    enabled: !!token,
  });

  useEffect(() => {
    if (data) {
      setHome(data?.homeAddress || null);
      setWork(data?.workAddress || null);
      setOther(data?.otherAddress || []);
    }
  }, [data]);

  const handleSetUserGeofence = useMutation({
    mutationKey: ["set-user-geofence"],
    mutationFn: ({
      latitude,
      longitude,
      type,
      otherId,
      address,
    }: {
      latitude: number;
      longitude: number;
      type: string;
      otherId: string;
      address: string;
    }) => setGeofenceForUser(latitude, longitude),
    onSuccess: (data, variables) => {
      if (data.success) {
        useAuthStore.setState({
          userAddress: {
            type: variables.type,
            otherId: variables.otherId,
            address: variables.address,
          },
          location: {
            latitude: variables.latitude,
            longitude: variables.longitude,
          },
        });

        queryClient.cancelQueries();

        if (router.canGoBack()) {
          router.back();
        }
      }
    },
  });

  const handleSelectAddress = (
    type: string,
    otherId: string,
    address: string,
    coordinates: UserAddressProps["coordinates"]
  ) => {
    if (!coordinates) return;

    if (type === "other") {
      if (setAsUserAddress && !showActionButton) {
        handleSetUserGeofence.mutate({
          latitude: coordinates[0],
          longitude: coordinates[1],
          type,
          otherId,
          address,
        });
      }
    } else {
      if (setAsUserAddress && !showActionButton) {
        handleSetUserGeofence.mutate({
          latitude: coordinates[0],
          longitude: coordinates[1],
          type,
          otherId,
          address,
        });
      }
    }

    if (addressFor === "pick") setPickAddress({ type, otherId, address });
    else if (addressFor === "drop") setDropAddress({ type, otherId, address });

    !showActionButton && !handleSetUserGeofence.isPending && router.back();
  };

  const handleDeleteAddressMutation = useMutation({
    mutationKey: ["update-address"],
    mutationFn: (data: UserAddressProps) => updateUserAddress(data),
    onSuccess: (data, variables) => {
      if (data.success && !data.address) {
        if (
          variables.type === useAuthStore.getState().userAddress.type &&
          !variables.id
        ) {
          variables.type === "home" && setHome(null);
          variables.type === "work" && setWork(null);
          useAuthStore.setState({
            userAddress: {
              type: "",
              otherId: "",
              address: "",
            },
          });
        } else if (
          variables.id === useAuthStore.getState().userAddress.otherId
        ) {
          setOther((prev) => prev.filter((addr) => addr.id !== variables.id));
          useAuthStore.setState({
            userAddress: {
              type: "",
              otherId: "",
              address: "",
            },
          });
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

    handleDeleteAddressMutation.mutate(address);
  };

  const renderAddress = ({ address }: { address: UserAddressProps | null }) => {
    const formattedAddress = `${address?.flat}, ${address?.area}, ${address?.landmark}`;

    const isSelected =
      userSelectedAddress.type === "other"
        ? userSelectedAddress.otherId === address?.id
        : userSelectedAddress.type === address?.type;

    return (
      <Pressable
        onPress={() =>
          handleSelectAddress(
            address?.type as string,
            (address?.id as string) || "",
            formattedAddress,
            address?.coordinates as UserAddressProps["coordinates"]
          )
        }
        style={{
          marginTop: 15,
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          borderColor:
            isSelected && !showActionButton && setAsUserAddress
              ? colors.PRIMARY
              : colors.NEUTRAL400,
          backgroundColor:
            isSelected && !showActionButton && setAsUserAddress
              ? colors.PRIMARY_LIGHT
              : colors.WHITE,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ width: "100%" }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View>
              <View
                style={{
                  backgroundColor:
                    isSelected && !showActionButton && setAsUserAddress
                      ? colors.PRIMARY
                      : colors.NEUTRAL200,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: verticalScale(5),
                  marginBottom: verticalScale(5),
                  borderRadius: radius._3,
                  alignSelf: "flex-start",
                  paddingHorizontal: scale(8),
                }}
              >
                <Typo
                  size={12}
                  color={
                    isSelected && !showActionButton && setAsUserAddress
                      ? colors.WHITE
                      : colors.NEUTRAL900
                  }
                  fontFamily="Medium"
                >
                  {address?.type
                    ? address.type.charAt(0).toUpperCase() +
                      address.type.slice(1)
                    : ""}
                </Typo>
              </View>

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
                  onPress={() => {
                    router.push({
                      pathname: "/screens/common/EditAddress",
                      params: {
                        addressType: address?.type,
                        address: JSON.stringify(address),
                      },
                    });
                  }}
                  style={{ padding: scale(3) }}
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

                <Pressable
                  onPress={() =>
                    handleDelete(address?.type as string, address?.id)
                  }
                  style={{ padding: scale(3) }}
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
              </View>
            )}
          </View>

          <View>
            <Typo size={12} color={colors.NEUTRAL500} style={{ width: "75%" }}>
              {address?.flat}, {address?.area}, {address?.landmark}
            </Typo>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenWrapper>
      {showActionButton && <Header title="Saved Address" />}

      {isLoading ? (
        <AddressLoader />
      ) : (
        <>
          <View
            style={{
              paddingHorizontal: scale(20),
              marginTop: showActionButton ? verticalScale(30) : 0,
              marginBottom: showActionButton ? verticalScale(10) : 0,
            }}
          >
            <Button
              title="Add new Address"
              onPress={() => router.push("/screens/common/add-address")}
              icon={
                <MapPin size={scale(16)} color={colors.WHITE} weight="fill" />
              }
            />
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: scale(20),
              paddingBottom: verticalScale(50),
            }}
            showsVerticalScrollIndicator={false}
          >
            {!home?.coordinates && !work?.coordinates && other.length === 0 && (
              <View
                style={{
                  flex: 1,
                  marginTop: verticalScale(20),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/No-address.webp")}
                  style={{
                    width: scale(250),
                    height: verticalScale(250),
                    resizeMode: "cover",
                  }}
                />

                <Typo size={16} color={colors.NEUTRAL800} fontFamily="SemiBold">
                  No saved addresses
                </Typo>
                <Typo size={12} color={colors.NEUTRAL400}>
                  You have not saved any of your addresses
                </Typo>
              </View>
            )}

            {home?.coordinates?.length && renderAddress({ address: home })}
            {work?.coordinates?.length && renderAddress({ address: work })}
            {other?.map((address) => (
              <View key={address.id}>{renderAddress({ address })}</View>
            ))}
          </ScrollView>
        </>
      )}
    </ScreenWrapper>
  );
};

export default UserSavedAddress;
