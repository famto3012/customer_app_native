export const merchantFilters = [
  { label: "All", value: "all" },
  { label: "Veg", value: "Veg" },
  { label: "Rating 4.0+", value: "Rating" },
  { label: "Nearest", value: "Nearby" },
];

export const productFilters = [
  { label: "All", value: "all" },
  { label: "Veg", value: "Veg" },
  { label: "Non-veg", value: "Non-veg" },
  { label: "Top rated", value: "rating" },
];

export const addressTabs = [
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Others", value: "others" },
];

export const scheduleDetails = [
  "For eg: If you need a product delivered on a specific day, please select the exact date that meets your requirement. If you need a product delivered over multiple days, please select a date range that fits your schedule.",
  "In case of multiple orders, the entire cart will be recurring, so please double-check the products before confirming your order.",
  "You cannot cancel the multiple orders once the order is placed.",
];

export const profileOptions: {
  label: string;
  route: `/${string}`;
  image: any;
}[] = [
  {
    label: "Saved Address",
    route: "/screens/user/user-address",
    image: require("@/assets/icons/book-square.webp"),
  },
  {
    label: "Favourites",
    route: "/screens/user/favorites",
    image: require("@/assets/icons/heart.webp"),
  },
  {
    label: "Loyalty Points",
    route: "/screens/user/loyalty-points",
    image: require("@/assets/icons/tag-2.webp"),
  },
  {
    label: "Refer and Earn",
    route: "/screens/user/referral",
    image: require("@/assets/icons/gift.webp"),
  },
  {
    label: "Settings",
    route: "/screens/user/settings",
    image: require("@/assets/icons/setting.webp"),
  },
  {
    label: "Rate Us",
    route: "/screens/user/referral",
    image: require("@/assets/icons/star.webp"),
  },
  {
    label: "About Us",
    route: "/screens/user/about-us",
    image: require("@/assets/icons/info-circle.webp"),
  },
];

export const loyaltyDetails = [
  "Earn Points: ₹100 spent = 10 points.",
  "Minimum Order to Earn: ₹500.",
  "Maximum Points per Order: 500 points.",
  "Points Expiry: 180 days.",
  "Redeem Points: 50 points = ₹5.",
  "Minimum Order to Redeem: ₹300.",
  "Minimum Points for Redemption: 100 points.",
  "Max Redemption: Up to 20% of order value.",
];

export const referralDetails = [
  "Share the referral link with your friends ",
  "Your friend clicks on the link or signs up through the code",
  "You receives 50 Famto Cash. When your friend completes an order of ₹300 or more within 7 days, your friend receives ₹25. Up to ₹500 in Famto Cash can be earned.",
];

export const customOrderDetails = [
  "Sending high-value or fragile products should be avoided.",
  "Items should fit inside the backpack.",
  "Transporting illegal goods is prohibited.",
];

export const unitData = [
  { label: "kg", value: "kg" },
  { label: "gm", value: "g" },
  { label: "ltr", value: "ltr" },
  { label: "ml", value: "ml" },
  { label: "m", value: "m" },
  { label: "cm", value: "cm" },
];
