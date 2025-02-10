import { BASE_URL } from "@/constants/links";
import { useAuthStore } from "@/store/store";
import { AuthPayload } from "@/types";
import { resetAndNavigate } from "@/utils/navigation";
import axios from "axios";
import { Alert } from "react-native";

export const signIn = async (payload: AuthPayload) => {
  try {
    const { setUserId, setToken, setRefreshToken } = useAuthStore.getState();

    const res = await axios.post(`${BASE_URL}/customers/authenticate`, payload);

    const { id, token, refreshToken } = res.data;

    setUserId(id);
    setToken(token);
    setRefreshToken(refreshToken);

    resetAndNavigate("/(tabs)");
  } catch (err: any) {
    if (err.response) {
      console.error("Server error:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("Network error or no response:", err.request);
    } else {
      console.error("Error:", err.message);
    }
    Alert.alert("Something went wrong");
  }
};

export const logout = async (disconnect?: () => void) => {
  try {
    const { clearStorage } = useAuthStore.getState();

    clearStorage();
    resetAndNavigate("/auth");
  } catch (err) {
    console.log(`Error while logging out: ${err}`);
    Alert.alert("Error", "Something went wrong!");
  }
};
