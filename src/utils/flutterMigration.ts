import SharedPreferences from "react-native-shared-preferences";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Keychain from "react-native-keychain";

export const migrateData = async () => {
  try {
    console.log("Starting migration...");

    // Read and migrate latitude
    SharedPreferences.getItem("latitude", async (latitude) => {
      if (latitude) {
        await AsyncStorage.setItem("latitude", latitude);
        SharedPreferences.removeItem("latitude");
      }
    });

    // Read and migrate longitude
    SharedPreferences.getItem("longitude", async (longitude) => {
      if (longitude) {
        await AsyncStorage.setItem("longitude", longitude);
        SharedPreferences.removeItem("longitude");
      }
    });

    // Read and migrate user ID
    SharedPreferences.getItem("id", async (id) => {
      if (id) {
        await AsyncStorage.setItem("userId", id);
        SharedPreferences.removeItem("id");
      }
    });

    // Read and migrate token (secure storage)
    SharedPreferences.getItem("token", async (token) => {
      if (token) {
        await Keychain.setGenericPassword("token", token, { service: "token" });
        SharedPreferences.removeItem("token");
      }
    });

    // Read and migrate refreshToken (secure storage)
    SharedPreferences.getItem("refreshToken", async (refreshToken) => {
      if (refreshToken) {
        await Keychain.setGenericPassword("refreshToken", refreshToken, {
          service: "refreshToken",
        });
        SharedPreferences.removeItem("refreshToken");
      }
    });

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  }
};
