import {
  Alert,
  AppState,
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import SchedulePicker from "@/components/common/SchedulePicker";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Address from "@/components/common/Address";
import Instructions from "@/components/common/Instructions";
import Button from "@/components/Button";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { commonStyles } from "@/constants/commonStyles";
import ScheduleSheet from "@/components/BottomSheets/ScheduleSheet";
import PickAndDropItemSheet from "@/components/BottomSheets/pickAndDrop/PickAndDropItemSheet";
import { PickAndDropItemProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { addPickAndDropAddress } from "@/service/pickandDropService";
import { router } from "expo-router";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

// Global audio reference - will ensure we only have one audio instance
let GLOBAL_SOUND: Audio.Sound | null = null;

interface FormDataProps {
  pickUpAddressType: string;
  pickUpAddressOtherAddressId?: string;
  deliveryAddressType: string;
  deliveryAddressOtherAddressId?: string;
  instructionInPickup: string;
  instructionInDelivery: string;
  startDate?: string;
  endDate?: string;
  time?: string;
}

const PickDropScreen = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    pickUpAddressType: "",
    pickUpAddressOtherAddressId: "",
    deliveryAddressType: "",
    deliveryAddressOtherAddressId: "",
    instructionInPickup: "",
    instructionInDelivery: "",
    startDate: "",
    endDate: "",
    time: "",
  });
  const [voiceInstruction, setVoiceInstruction] = useState({
    pick: "",
    delivery: "",
  });
  const [item, setItem] = useState<PickAndDropItemProps | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const scheduleSheetRef = useRef<BottomSheet>(null);
  const addItemSheetRef = useRef<BottomSheet>(null);
  const isNavigatingRef = useRef(false);

  const scheduleSheetSnapPoints = useMemo(() => ["85%"], []);
  const addItemSheetSnapPoints = useMemo(() => ["60%"], []);

  const navigation = useNavigation();

  const onPickVoice = (data: string) => {
    setVoiceInstruction({ ...voiceInstruction, pick: data });
  };

  const onDeliveryVoice = (data: string) => {
    setVoiceInstruction({ ...voiceInstruction, delivery: data });
  };

  const forceAudioCleanup = async () => {
    try {
      // Force set our state regardless of what happens with the actual cleanup
      setIsPlaying(false);

      // If we have a reference to the global sound
      if (GLOBAL_SOUND) {
        try {
          await GLOBAL_SOUND.pauseAsync().catch(() => {});

          await GLOBAL_SOUND.stopAsync().catch(() => {});

          await GLOBAL_SOUND.unloadAsync().catch(() => {});
        } catch (e) {
          console.log("Caught error during force cleanup:", e);
        }

        // Clear the global reference
        GLOBAL_SOUND = null;
      }

      // Try to set volume to 0 on the Audio module directly (as a last resort)
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
        });
      } catch (e) {
        console.log("Error setting audio mode:", e);
      }
    } catch (e) {
      console.error("Critical error in force cleanup:", e);
    }
  };

  const playOrStopSound = async () => {
    try {
      if (isPlaying) {
        await forceAudioCleanup();
      } else {
        // Force cleanup first in case there's a lingering instance
        await forceAudioCleanup();

        // Create new sound
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            {
              uri: "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FScheduled%20Order.mp3?alt=media&token=da59e122-08f8-4964-8b6f-bfebc8c32fbe",
            },
            { shouldPlay: true }
          );

          // Set our global reference
          GLOBAL_SOUND = newSound;
          setIsPlaying(true);

          newSound.setOnPlaybackStatusUpdate((status) => {
            if (
              status.isLoaded &&
              (status as AVPlaybackStatusSuccess).didJustFinish
            ) {
              forceAudioCleanup();
            }
          });
        } catch (soundError) {
          console.error("Error creating sound:", soundError);
          forceAudioCleanup();
        }
      }
    } catch (error) {
      console.error("Critical error in playOrStopSound:", error);
      forceAudioCleanup();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active") {
        console.log("App going to background");
        forceAudioCleanup();
      }
    });

    return () => subscription.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        forceAudioCleanup();
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  // On navigation gestures
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      forceAudioCleanup();
    });

    return unsubscribe;
  }, [navigation]);

  // On component unmount
  useEffect(() => {
    return () => {
      forceAudioCleanup();
    };
  }, []);

  // On screen focus change
  useFocusEffect(
    useCallback(() => {
      // Cleanup when losing focus
      return () => {
        if (!isNavigatingRef.current) {
          forceAudioCleanup();
        }
      };
    }, [])
  );

  const handleSelectPickupAddress = (
    type: string,
    otherId?: string,
    address?: string
  ) => {
    // Reset any previous errors
    setAddressError(false);

    // Validate if this would create a duplicate with delivery address
    if (type !== "other" && type === formData.deliveryAddressType) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Pick and Delivery address cannot be same",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Error", "Pick and Delivery address cannot be same");
      }

      return false;
    }

    if (
      type === "other" &&
      otherId === formData.deliveryAddressOtherAddressId &&
      formData.deliveryAddressType === "other"
    ) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Pick and Delivery address cannot be same",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Error", "Pick and Delivery address cannot be same");
      }
      return false;
    }

    setFormData({
      ...formData,
      pickUpAddressType: type,
      pickUpAddressOtherAddressId: otherId,
    });
    return true;
  };

  const handleSelectDeliveryAddress = (
    type: string,
    otherId?: string,
    address?: string
  ) => {
    // Reset any previous errors
    setAddressError(false);

    // Validate if this would create a duplicate with pickup address
    if (type !== "other" && type === formData.pickUpAddressType) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Pick and Delivery address cannot be same",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Error", "Pick and Delivery address cannot be same");
      }
      setAddressError(true);
      return false;
    }

    if (
      type === "other" &&
      otherId === formData.pickUpAddressOtherAddressId &&
      formData.pickUpAddressType === "other"
    ) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Pick and Delivery address cannot be same",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Error", "Pick and Delivery address cannot be same");
      }
      setAddressError(true);
      return false;
    }

    setFormData({
      ...formData,
      deliveryAddressType: type,
      deliveryAddressOtherAddressId: otherId,
    });
    return true;
  };

  const handleAddAddressMutation = useMutation({
    mutationKey: ["add-pick-and-drop-address"],
    mutationFn: (data: FormData) => addPickAndDropAddress(data),
    onSuccess: (cartId) => {
      if (cartId) {
        router.push({
          pathname: "/screens/pickAndDrop/pick-and-Drop-Details",
          params: {
            item: item?.itemName ? JSON.stringify(item) : "",
            cartId,
          },
        });
        addItemSheetRef.current?.close();
      }
    },
  });

  const handleOnConfirm = (data: PickAndDropItemProps) => {
    try {
      setItem(data);

      const formDataObject = new FormData();

      function appendFormData(value: any, key: string) {
        if (value !== undefined && value !== null) {
          formDataObject.append(key, value);
        }
      }

      Object.entries(formData).forEach(([key, value]) => {
        appendFormData(value, key);
      });

      if (voiceInstruction.pick) {
        const fileName = voiceInstruction.pick.split("/").pop();
        const fileType = fileName?.split(".").pop() || "mp3";

        formDataObject.append("voiceInstructionInPickup", {
          uri: voiceInstruction.pick,
          name: `pick-voice-instruction.${fileType}`,
          type: `audio/${fileType}`,
        } as any);
      }

      if (voiceInstruction.delivery) {
        const fileName = voiceInstruction.delivery.split("/").pop();
        const fileType = fileName?.split(".").pop() || "mp3";

        formDataObject.append("voiceInstructionInDelivery", {
          uri: voiceInstruction.delivery,
          name: `delivery-voice-instruction.${fileType}`,
          type: `audio/${fileType}`,
        } as any);
      }

      handleAddAddressMutation.mutate(formDataObject);
    } catch (err) {
      console.log(`Error in handling confirm: ${err}`);
    }
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, commonStyles.backdrop]}
      />
    ),
    []
  );

  return (
    <>
      <ScreenWrapper>
        <Header title="Pick & Drop" />

        <ScrollView
          contentContainerStyle={{
            paddingBottom: verticalScale(20),
            paddingTop: verticalScale(20),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SchedulePicker
            onPress={() => scheduleSheetRef.current?.snapToIndex(0)}
            value={{
              startDate: formData?.startDate || "",
              endDate: formData?.endDate || "",
              time: formData?.time || "",
            }}
            onClearSchedule={() =>
              setFormData({ ...formData, startDate: "", endDate: "", time: "" })
            }
          />

          <View style={styles.pickupRow}>
            <Typo size={14} color={colors.NEUTRAL900} fontFamily="SemiBold">
              Pickup{" "}
              <Typo size={13} color={colors.NEUTRAL400}>
                (select a pickup address first)
              </Typo>
            </Typo>
          </View>

          <Address
            alreadySelect={false}
            onSelect={handleSelectPickupAddress}
            addressType={formData.pickUpAddressType}
            addressOtherId={formData.pickUpAddressOtherAddressId}
            validateSelection={true}
          />

          <Instructions
            placeholder="Instructions (if any)"
            onRecordComplete={onPickVoice}
            onChangeText={(data: string) =>
              setFormData({ ...formData, instructionInPickup: data })
            }
          />

          {formData.pickUpAddressType && (
            <>
              <View style={styles.pickupRow}>
                <Typo size={14} color={colors.BLACK} fontWeight={700}>
                  Drop
                </Typo>
              </View>

              <Address
                onSelect={handleSelectDeliveryAddress}
                addressType={addressError ? "" : formData.deliveryAddressType}
                addressOtherId={
                  addressError ? "" : formData.deliveryAddressOtherAddressId
                }
                validateSelection={true}
              />

              <Instructions
                placeholder="Instructions (if any)"
                onRecordComplete={onDeliveryVoice}
                onChangeText={(data: string) =>
                  setFormData({ ...formData, instructionInDelivery: data })
                }
              />
            </>
          )}
        </ScrollView>

        {formData.pickUpAddressType && formData.deliveryAddressType && (
          <View style={styles.confirmContainer}>
            <Button
              title="Enter package detail"
              onPress={() => addItemSheetRef.current?.expand()}
            />
          </View>
        )}
      </ScreenWrapper>

      <BottomSheet
        ref={scheduleSheetRef}
        index={-1}
        snapPoints={scheduleSheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={() => forceAudioCleanup()}
      >
        <ScheduleSheet
          onPress={(startDate: string, endDate: string, time: string) => {
            forceAudioCleanup();
            scheduleSheetRef?.current?.close();
            setFormData({ ...formData, startDate, endDate, time });
          }}
          playSound={playOrStopSound}
          isPlaying={isPlaying}
        />
      </BottomSheet>

      <BottomSheet
        ref={addItemSheetRef}
        index={-1}
        snapPoints={addItemSheetSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <PickAndDropItemSheet
          heading="Add Item"
          buttonLabel="Confirm"
          onConfirm={handleOnConfirm}
          isLoading={handleAddAddressMutation.isPending}
        />
      </BottomSheet>
    </>
  );
};

export default PickDropScreen;

const styles = StyleSheet.create({
  pickupRow: {
    marginBottom: verticalScale(24),
    marginTop: verticalScale(10),
    marginHorizontal: scale(20),
    flexDirection: "row",
    alignItems: "center",
  },
  confirmContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    backgroundColor: colors.WHITE,
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});
