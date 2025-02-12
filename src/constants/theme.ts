import { scale, verticalScale } from "@/utils/styling";

export const colors = {
  PRIMARY: "#00CED1",
  PRIMARY_LIGHT: "#E5FAFA",
  TEXT: "#FFF",
  TEXT_LIGHT: "#E5E5E5",
  TEXT_LIGHTER: "#D4D4D4",
  WHITE: "#FBFBFB",
  BLACK: "#333",
  YELLOW: "#FFB400",
  GREEN: "#5EC401",
  RED: "#DE0000",
  LIGHT_RED: "#FCE6E6",
  NEUTRAL50: "#FAFAFA",
  NEUTRAL100: "#F7F7F7",
  NEUTRAL200: "#E5E5E5",
  NEUTRAL300: "#D4D4D4",
  NEUTRAL350: "#CCCCCC",
  NEUTRAL400: "#A3A3A3",
  NEUTRAL500: "#737373",
  NEUTRAL600: "#525252",
  NEUTRAL700: "#404040",
  NEUTRAL800: "#262626",
  NEUTRAL900: "#171717",
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
};
