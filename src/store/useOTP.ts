import { create } from "zustand";
import auth from "@react-native-firebase/auth";

// auth().settings.appVerificationDisabledForTesting = true;

interface OTPState {
  verificationId: string | null;
  isVerified: boolean;
  setVerificationId: (id: string) => void;
  setIsVerified: (status: boolean) => void;
  setupRecaptcha: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string, verificationId: string) => Promise<void>;
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
      console.log("Verification ID set:", confirmation.verificationId);
    } catch (error) {
      console.error("Phone number verification failed:", error);
      throw new Error("Phone number verification failed. Please try again.");
    }
  },

  verifyOTP: async (otp: string, verificationId: string) => {
    try {
      if (!verificationId)
        throw new Error("No verification ID found. Please retry login.");

      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth().signInWithCredential(credential);
      set({ isVerified: true });
      console.log("OTP verified successfully!");
    } catch (error: any) {
      console.error("OTP Verification failed:", error.message);
      throw new Error("Invalid OTP. Please try again.");
    }
  },
}));
