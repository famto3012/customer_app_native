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
  "If you need a product on a specific day, choose the exact date.",
  "If you want delivery over several days, choose a date range that is suitable for you.",
  "The entire orders will be repeated(whichever pickups n drops your have selected for repeating) , so check your items carefully before confirming.",
  "You cannot cancel multiple orders once they're placed.",
];

export const profileOptions: {
  label: string;
  route: `/${string}` | { pathName: string; params: any };
  image: any;
}[] = [
  {
    label: "Saved Address",
    route: {
      pathName: "/screens/user/new-address-ui",
      params: { showSelection: "false", showActionButton: "true" },
    },
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

export const pickAndDropHomeImages = [
  {
    source: require("@/assets/images/Pick-and-drop-home.webp"),
    text: "Forgot something at home?",
  },
  {
    source: require("@/assets/images/Pick-and-drop-home1.webp"),
    text: "Delivery boys available anytime",
  },
  {
    source: require("@/assets/images/location-permission.webp"),
    text: "Fast and safe delivery",
  },
];

export const pickAndDropSubtexts = [
  "Give us a pickup address",
  "Our delivery agents are at your service",
  "We ensure safe and fast delivery every time",
];

export const pickAndDropItemTypes = [
  { label: "Documents & Parcels", value: "Documents & Parcels" },
  { label: "Food & Groceries", value: "Food & Groceries" },
  { label: "Clothing & Laundry", value: "Clothing & Laundry" },
  { label: "Medical Supplies", value: "Medical Supplies" },
  { label: "Personal Items", value: "Personal Items" },
  { label: "Gifts & Flowers", value: "Gifts & Flowers" },
  { label: "Electronics", value: "Electronics" },
  { label: "Household Items", value: "Household Items" },
  { label: "Books & Stationery", value: "Books & Stationery" },
  { label: "Online Orders", value: "Online Orders" },
  { label: "Pet Supplies", value: "Pet Supplies" },
  { label: "Automotive Parts", value: "Automotive Parts" },
  { label: "Others", value: "Others" },
];

export const pickAndDropVehicleDetail = [
  {
    image: require("@/assets/icons/scooter.webp"),
    name: "Scooter",
    capacity: "20kg",
    size: "45cm*45cm*45cm",
  },
  {
    image: require("@/assets/icons/motorcycle.webp"),
    name: "Bike",
    capacity: "20kg",
    size: "45cm*45cm*45cm",
  },
];
