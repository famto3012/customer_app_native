import Button from "@/components/Button";
import MapDetailLoader from "@/components/Loader/MapDetailLoader";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { commonStyles } from "@/constants/commonStyles";
import {
  MAPPLS_CLIENT_ID,
  MAPPLS_CLIENT_SECRET_KEY,
  MAPPLS_REST_API_KEY,
} from "@/constants/links";
import { colors, radius } from "@/constants/theme";
import { verifyCustomerAddressLocation } from "@/service/userService";
import { LocationAddressProps, UserAddressProps } from "@/types";
import {
  scale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  verticalScale,
} from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useMutation } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import MapplsGL from "mappls-map-react-native";
import MapplsUIWidgets from "mappls-search-widgets-react-native";
import { CaretLeft, GpsFix, MagnifyingGlass } from "phosphor-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import EditAddressDetail from "./EditAddressDetail";

const { MapView, Camera, RestApi, UserLocation } = MapplsGL;

MapplsGL.setMapSDKKey(MAPPLS_REST_API_KEY);
MapplsGL.setRestAPIKey(MAPPLS_REST_API_KEY);
MapplsGL.setAtlasClientId(MAPPLS_CLIENT_ID);
MapplsGL.setAtlasClientSecret(MAPPLS_CLIENT_SECRET_KEY);

const EditAddress = () => {
  const { address, addressType }: { address: any; addressType: string } =
    useLocalSearchParams();
  const router = useRouter();

  const parsedAddress = address ? JSON.parse(address) : null;

  const [isAddressParsed, setIsAddressParsed] = useState(false);
  const [markerCoordinates, setMarkerCoordinates] = useState<number[]>(
    parsedAddress?.coordinates?.length === 2
      ? [parsedAddress.coordinates[1], parsedAddress.coordinates[0]]
      : [0, 0]
  );
  const [mapplsPin, setMapplsPin] = useState<string>("");
  const [locationDetails, setLocationDetails] =
    useState<LocationAddressProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [addressData, setAddressData] = useState<UserAddressProps>({
    area: parsedAddress?.area || "",
    flat: parsedAddress?.flat || "",
    phoneNumber: parsedAddress?.phoneNumber || "",
    landmark: parsedAddress?.landmark || "",
    fullName: parsedAddress?.fullName || "",
    id: parsedAddress?.id || "",
    type: addressType,
    coordinates: parsedAddress?.coordinates || [],
  });
  const [mapReady, setMapReady] = useState(false);
  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const initialCameraSetRef = useRef<boolean>(false);
  const editAddressSheetRef = useRef<BottomSheetMethods | null>(null);

  const editAddressSnapPoints = useMemo(() => ["58%"], []);

  // Initialize MapplsGL

  // Parse address and set initial marker coordinates
  useEffect(() => {
    if (parsedAddress?.coordinates?.length === 2) {
      // Set longitude, latitude format for the map
      const coordinates = [
        parsedAddress.coordinates[1],
        parsedAddress.coordinates[0],
      ];
      setMarkerCoordinates(coordinates);

      setAddressData((prev: UserAddressProps) => ({
        ...prev,
        area: parsedAddress.area || "",
        flat: parsedAddress.flat || "",
        phoneNumber: parsedAddress.phoneNumber || "",
        landmark: parsedAddress.landmark || "",
        fullName: parsedAddress.fullName || "",
        id: parsedAddress.id || "",
        type: addressType,
        coordinates: parsedAddress.coordinates,
      }));

      setIsAddressParsed(true);

      // Reverse geocode the initial coordinates to get address details
      if (coordinates[0] !== 0 && coordinates[1] !== 0) {
        reverseGeocode(coordinates);
      }
    }
  }, [address, addressType]);

  // Set camera position when map is ready and coordinates are available
  useEffect(() => {
    if (
      mapReady &&
      isAddressParsed &&
      !initialCameraSetRef.current &&
      cameraRef.current
    ) {
      // Only set camera position once
      initialCameraSetRef.current = true;

      // Ensure we have valid coordinates
      if (markerCoordinates[0] !== 0 && markerCoordinates[1] !== 0) {
        cameraRef.current.setCamera({
          centerCoordinate: markerCoordinates,
          zoomLevel: zoomLevel,
          animationDuration: 500,
        });
      }
    }
  }, [mapReady, isAddressParsed, markerCoordinates, zoomLevel]);

  const reverseGeocode = async (coordinates: number[]) => {
    try {
      setLoading(true);
      const [longitude, latitude] = coordinates;

      const reverseGeoParams = {
        longitude,
        latitude,
      };

      const response = await RestApi.reverseGeocode(reverseGeoParams);

      if (response && response.results && response.results.length > 0) {
        const result = response.results[0];
        setLocationDetails({
          address: result.formatted_address || "Address not available",
          locality: result.locality || "",
          district: result.district || "",
          state: result.state || "",
          pinCode: result.pincode || "",
          placeType: result.street_dist || "",
          poi: result.poi || "",
        });
        setAddressData((prev: any) => ({
          ...prev,
          area: result.locality || prev?.area || "",
          coordinates: [latitude, longitude],
        }));
      } else {
        setLocationDetails({
          address: "No address found for this location",
          locality: null,
          district: null,
          state: null,
          pinCode: null,
          placeType: null,
          poi: null,
        });
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setLocationDetails({
        address: "Error retrieving location details",
        locality: null,
        district: null,
        state: null,
        pinCode: null,
        placeType: null,
        poi: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await MapplsUIWidgets.searchWidget({
        toolbarColor: "#F5F5F5",
        hyperLocal: true,
        location: markerCoordinates,
        zoom: zoomLevel,
      });

      if (res && res.eLocation) {
        if (res.eLocation.mapplsPin) {
          setMapplsPin(res.eLocation.mapplsPin);
        }
        cameraRef.current.flyWithMapplsPin(res.eLocation.mapplsPin, 1000);

        setLocationDetails({
          address: res.eLocation.placeAddress || "Address not available",
          locality: null,
          district: null,
          state: null,
          pinCode: null,
          placeType: null,
          poi: null,
        });
      } else {
        console.error("Invalid Search Result");
      }
    } catch (e) {
      console.log("Search Widget Error:", e);
    }
  };

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        const { status: newStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (newStatus !== "granted") {
          return false;
        }
        status = newStatus;
      }

      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      }).catch(() => null);

      if (!location) {
        setLoading(false);
        return false;
      }

      const { latitude, longitude } = location.coords;
      const newCoords = [longitude, latitude];
      setMarkerCoordinates(newCoords);

      // When getting current location, update camera position
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: newCoords,
          zoomLevel: 15,
          animationDuration: 1000,
        });
      }

      reverseGeocode(newCoords);
      return true;
    } catch (error) {
      console.error("Location error:", error);
      setLoading(false);
      return false;
    }
  };

  const verifyLocationMutation = useMutation({
    mutationKey: ["verify-location"],
    mutationFn: async () => {
      if (addressData?.coordinates?.length === 2) {
        return verifyCustomerAddressLocation(
          addressData.coordinates[0],
          addressData.coordinates[1]
        );
      }
      throw new Error("Invalid coordinates");
    },
    onSuccess: (data) => {
      if (data) {
        editAddressSheetRef.current?.expand();
      } else {
        if (Platform.OS === "android") {
          ToastAndroid.showWithGravity(
            "Sorry, we're not currently delivering to this location",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        } else {
          Alert.alert(
            "",
            "Sorry, we're not currently delivering to this location"
          );
        }
      }
    },
    onError: (error) => {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          "An error occurred while verifying the location.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("", "An error occurred while verifying the location.");
      }
    },
  });

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

  const handleMapReady = () => {
    setMapReady(true);
  };

  return (
    <>
      <ScreenWrapper>
        <View style={styles.container}>
          {isAddressParsed ? (
            <MapView
              ref={mapRef}
              style={styles.map}
              zoomEnabled={true}
              scrollEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
              compassEnabled={true}
              attributionEnabled={true}
              onDidFinishRenderingMapFully={handleMapReady}
              onRegionDidChange={(event) => {
                if (!mapReady) return;
                const { geometry, properties } = event;
                if (properties && properties.zoomLevel) {
                  setZoomLevel(properties.zoomLevel);
                }
                if (geometry && geometry.coordinates) {
                  const [longitude, latitude] = geometry.coordinates;

                  const newCoords = [longitude, latitude];
                  setMarkerCoordinates(newCoords);
                  reverseGeocode(newCoords);
                }
              }}
            >
              <Camera
                ref={cameraRef}
                zoomLevel={zoomLevel}
                centerCoordinate={markerCoordinates}
                animationMode="easeTo"
                minZoomLevel={4}
                maxZoomLevel={20}
              />

              <UserLocation
                visible={true}
                animated={true}
                showsUserHeadingIndicator={true}
              />
            </MapView>
          ) : (
            <ActivityIndicator
              size="large"
              color={colors.PRIMARY}
              style={{ flex: 1 }}
            />
          )}

          <View style={styles.centerMarkerContainer}>
            <View style={styles.deliveryMessageContainer}>
              <Typo
                fontFamily="SemiBold"
                size={13}
                color={colors.WHITE}
                style={styles.deliveryMessage}
              >
                Order will be delivered here
              </Typo>
              <Typo
                size={9}
                color={colors.WHITE}
                style={styles.deliveryMessage}
              >
                Move the pin to change location
              </Typo>
              <View style={styles.deliveryMessagePointer} />
            </View>
            <LottieView
              source={require("@/assets/images/location.json")}
              autoPlay
              loop
              style={styles.centerMarker}
              renderMode="HARDWARE"
              cacheComposition={true}
            />
          </View>

          {/* Search Button */}
          <View
            style={{
              position: "absolute",
              top: Platform.OS === "ios" ? 20 : 30,
              left: 20,
              right: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: scale(10),
            }}
          >
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <CaretLeft
                size={verticalScale(20)}
                color={colors.PRIMARY}
                weight="bold"
              />
            </Pressable>

            <Pressable
              onPress={handleSearch}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: scale(35),
                backgroundColor: colors.WHITE,
                paddingVertical: verticalScale(7),
                borderRadius: radius._6,
              }}
            >
              <TextInput
                placeholder="Search for a building, street name or area"
                editable={false}
                pointerEvents="none"
                style={styles.searchInput}
                allowFontScaling={false}
              />
              <MagnifyingGlass color={colors.NEUTRAL500} size={24} />
            </Pressable>
          </View>

          {/* Location Details Container */}
          <View style={styles.detailsContainer}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pressable
                style={styles.currentLocationButton}
                onPress={requestLocationPermission}
              >
                <GpsFix color={colors.PRIMARY} size={22} weight="fill" />
                <Typo size={13} fontFamily="SemiBold" color={colors.PRIMARY}>
                  Use Current Location
                </Typo>
              </Pressable>
            </View>

            <View style={styles.detailsContainerInside}>
              {loading ? (
                <MapDetailLoader />
              ) : locationDetails ? (
                <>
                  <Typo
                    size={14}
                    fontFamily="SemiBold"
                    color={colors.NEUTRAL900}
                    style={styles.detailsText}
                  >
                    {locationDetails.address}
                  </Typo>
                  {locationDetails.locality && (
                    <Typo
                      size={12}
                      color={colors.NEUTRAL500}
                      style={styles.detailsSubtext}
                    >
                      {locationDetails.locality}, {locationDetails.district}
                    </Typo>
                  )}
                  {locationDetails.state && (
                    <Typo
                      size={12}
                      color={colors.NEUTRAL500}
                      style={styles.detailsSubtext}
                    >
                      {locationDetails.state}{" "}
                      {locationDetails.pinCode
                        ? `- ${locationDetails.pinCode}`
                        : ""}
                    </Typo>
                  )}
                  <Button
                    title="Confirm Location"
                    style={{ marginTop: scale(10) }}
                    isLoading={verifyLocationMutation.isPending}
                    onPress={() => verifyLocationMutation.mutate()}
                  />
                </>
              ) : (
                <MapDetailLoader />
              )}
            </View>
          </View>
        </View>
      </ScreenWrapper>

      <BottomSheet
        ref={editAddressSheetRef}
        index={-1}
        snapPoints={editAddressSnapPoints}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <EditAddressDetail
          editAddressSheetRef={editAddressSheetRef}
          addressData={addressData}
        />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: scale(-20),
  },
  map: {
    flex: 1,
  },
  searchButton: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.WHITE,
    padding: 10,
    borderRadius: 10,
    shadowColor: colors.NEUTRAL900,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  searchInput: {
    paddingVertical: scale(3),
    paddingHorizontal: scale(12),
    marginRight: scale(25),
  },
  detailsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  detailsContainerInside: {
    backgroundColor: colors.WHITE,
    padding: scale(20),
    borderRadius: 10,
    shadowColor: colors.NEUTRAL900,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    minHeight: SCREEN_HEIGHT * 0.2,
  },
  detailsTitle: {
    marginBottom: 5,
  },
  detailsText: {
    marginBottom: 3,
  },
  detailsSubtext: {
    marginBottom: 2,
  },
  currentLocationButton: {
    backgroundColor: colors.WHITE,
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.1,
    marginVertical: scale(10),
    borderRadius: scale(22),
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(10),
    shadowColor: colors.NEUTRAL900,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  currentLocationIcon: {
    width: 24,
    height: 24,
  },
  centerMarkerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
    transform: [
      { translateX: -SCREEN_WIDTH * 0.4 },
      { translateY: -SCREEN_WIDTH * 0.4 },
    ],
    pointerEvents: "none",
  },
  centerMarker: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
  },
  deliveryMessageContainer: {
    position: "absolute",
    bottom: "58%",
    alignSelf: "center",
    backgroundColor: colors.NEUTRAL900,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: colors.NEUTRAL900,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    width: SCREEN_WIDTH * 0.5,
    alignItems: "center",
  },
  deliveryMessage: {
    textAlign: "center",
  },
  deliveryMessagePointer: {
    position: "absolute",
    top: "120%",
    left: "50%",
    marginLeft: 2.5,
    width: 0,
    height: 0,
    borderLeftWidth: 7.5,
    borderRightWidth: 7.5,
    borderTopWidth: 20,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.NEUTRAL900,
  },
  backButton: {
    padding: scale(5),
    backgroundColor: colors.WHITE,
    borderRadius: radius._30,
  },
});

export default EditAddress;
