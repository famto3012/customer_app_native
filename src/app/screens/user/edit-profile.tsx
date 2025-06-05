import Button from "@/components/Button";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Input from "@/components/user/Input";
import { spacingY } from "@/constants/theme";
import { fetchUserProfile, updateUserProfile } from "@/service/userService";
import { useAuthStore } from "@/store/store";
import { UserProfileProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const EditProfile = () => {
  const [profileData, setProfileData] = useState<UserProfileProps>({
    customerId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    imageURL: "",
  });
  const [image, setImage] = useState<string | null>(null);

  const { token } = useAuthStore.getState();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UserProfileProps | null>({
    queryKey: ["customer-profile"],
    queryFn: fetchUserProfile,
    enabled: !!token,
  });

  useEffect(() => {
    data && setProfileData(data);
  }, [data]);

  const handleInputChange = (field: keyof UserProfileProps, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "Sorry, we need media library permissions to make this work!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert(
          "Error",
          "Sorry, we need media library permissions to make this work!"
        );
      }

      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handelUpdateMutation = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (data: FormData) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      router.back();
    },
  });

  const handleSave = (data: UserProfileProps) => {
    const formDataObject = new FormData();

    function appendFormData(value: any, key: string) {
      if (value !== undefined && value !== null) {
        formDataObject.append(key, value);
      }
    }

    Object.entries(data).forEach(([key, value]) => {
      appendFormData(value, key);
    });

    if (image) {
      const fileName = image.split("/").pop(); // Extract filename
      const fileType = fileName?.split(".").pop() || "jpg"; // Default to jpg

      formDataObject.append("image", {
        uri: image,
        name: `profile-image.${fileType}`,
        type: `image/${fileType}`,
      } as any); // Cast to avoid TypeScript error
    }

    handelUpdateMutation.mutate(formDataObject);
  };

  return (
    <ScreenWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Header title="Edit profile" />

          <ScrollView
            contentContainerStyle={{
              paddingBottom: 50,
              paddingHorizontal: 20,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.imageContainer}>
              <View style={{ position: "relative" }}>
                <Image
                  source={
                    image
                      ? {
                          uri: image,
                        }
                      : profileData?.imageURL
                      ? {
                          uri: profileData?.imageURL,
                        }
                      : require("@/assets/images/default-user.webp")
                  }
                  style={styles.image}
                />

                <Pressable
                  onPress={handleSelectFile}
                  style={styles.galleryIcon}
                >
                  <Image
                    source={require("@/assets/icons/gallery.webp")}
                    style={{ height: 20, width: 20 }}
                    resizeMode="cover"
                  />
                </Pressable>
              </View>
            </View>

            <View style={{ marginTop: verticalScale(30), gap: spacingY._30 }}>
              <Input
                label="Full Name"
                value={profileData?.fullName}
                onChangeText={(text) => handleInputChange("fullName", text)}
              />

              <Input
                label="Mobile number"
                value={profileData?.phoneNumber}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                disabled
              />

              <Input
                label="Email"
                value={profileData?.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              title="Save changes"
              onPress={() => handleSave(profileData)}
              isLoading={handelUpdateMutation.isPending}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 60,
  },
  image: {
    height: verticalScale(120),
    width: scale(120),
    borderRadius: 99,
    resizeMode: "cover",
  },
  galleryIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 99,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    backgroundColor: "white",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});
