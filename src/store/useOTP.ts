import { create } from "zustand";
import auth from "@react-native-firebase/auth"; // Use react-native-firebase

interface OTPState {
  verificationId: string | null;
  isVerified: boolean;
  setVerificationId: (id: string) => void;
  setIsVerified: (status: boolean) => void;
  setupRecaptcha: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
}

export const useOTPStore = create<OTPState>((set) => ({
  verificationId: null,
  isVerified: false,

  setVerificationId: (id) => set({ verificationId: id }),
  setIsVerified: (status) => set({ isVerified: status }),

  setupRecaptcha: async (phoneNumber: string) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      set({ verificationId: confirmation.verificationId });
    } catch (error) {
      console.error("Phone number verification failed:", error);
      throw error;
    }
  },

  verifyOTP: async (otp: string) => {
    try {
      const { verificationId } = useOTPStore.getState();
      if (!verificationId) throw new Error("No verification ID found");

      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth().signInWithCredential(credential);
      set({ isVerified: true });
    } catch (error) {
      console.error("OTP Verification failed:", error.message);
      throw error;
    }
  },
}));
