import { ScrollView, StyleSheet, View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import SchedulePicker from "@/components/common/SchedulePicker";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
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
import UserSelectedAddress from "@/components/common/UserSelectedAddress";
import { forceAudioCleanup, playOrStopSound } from "@/utils/helpers";
import { useAudioCleanup } from "@/hooks/useAudio";

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

type SelectedAddress = {
  type: string;
  otherId: string;
  address: string;
};

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
  const [isPlaying, setIsPlaying] = useState(false);

  const [selectedPickAddress, setSelectedPickAddress] =
    useState<SelectedAddress>({ type: "", otherId: "", address: "" });
  const [selectedDropAddress, setSelectedDropAddress] =
    useState<SelectedAddress>({ type: "", otherId: "", address: "" });

  const scheduleSheetRef = useRef<BottomSheet>(null);
  const addItemSheetRef = useRef<BottomSheet>(null);

  const scheduleSheetSnapPoints = useMemo(() => ["85%"], []);
  const addItemSheetSnapPoints = useMemo(() => ["60%"], []);

  useAudioCleanup();

  const onPickVoice = (data: string) => {
    setVoiceInstruction({ ...voiceInstruction, pick: data });
  };

  const onDeliveryVoice = (data: string) => {
    setVoiceInstruction({ ...voiceInstruction, delivery: data });
  };

  const handleSelectAddress = (type: string, address: SelectedAddress) => {
    if (type === "pick") {
      setSelectedPickAddress(address);
      setFormData({
        ...formData,
        pickUpAddressType: address.type,
        pickUpAddressOtherAddressId: address.otherId,
      });

      return;
    }
    if (type === "drop") {
      setSelectedDropAddress(address);
      setFormData({
        ...formData,
        deliveryAddressType: address.type,
        deliveryAddressOtherAddressId: address.otherId,
      });

      return;
    }
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

  const handleOnConfirm = (data: PickAndDropItemProps): boolean => {
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

      return handleAddAddressMutation.isSuccess;
    } catch (err) {
      console.log(`Error in handling confirm: ${err}`);
      return false;
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

          <UserSelectedAddress
            address={selectedDropAddress}
            deliveryMode="Pick and Drop"
            pick
            onSelect={(type: string, address: any) =>
              handleSelectAddress(type, address)
            }
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

              <UserSelectedAddress
                address={selectedPickAddress}
                deliveryMode="Pick and Drop"
                drop
                onSelect={(type: string, address: any) =>
                  handleSelectAddress(type, address)
                }
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
        onClose={() => forceAudioCleanup(setIsPlaying)}
      >
        <ScheduleSheet
          onPress={(startDate: string, endDate: string, time: string) => {
            forceAudioCleanup(setIsPlaying);
            scheduleSheetRef?.current?.close();
            setFormData({ ...formData, startDate, endDate, time });
          }}
          playSound={() =>
            playOrStopSound(
              "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/voices%2FScheduled%20Order.mp3?alt=media&token=da59e122-08f8-4964-8b6f-bfebc8c32fbe",
              isPlaying,
              setIsPlaying
            )
          }
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
