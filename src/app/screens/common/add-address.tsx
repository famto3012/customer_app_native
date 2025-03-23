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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import MapplsGL from "mappls-map-react-native";
import MapplsUIWidgets from "mappls-search-widgets-react-native";
import * as Location from "expo-location";
import { LocationAddressProps } from "@/types";
import { useAuthStore } from "@/store/store";
import { colors } from "@/constants/theme";
import { scale } from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import Typo from "@/components/Typo";
import LottieView from "lottie-react-native";
import { GpsFix, MagnifyingGlass } from "phosphor-react-native";
import Button from "@/components/Button";
import {
  MAPPLS_CLIENT_ID,
  MAPPLS_CLIENT_SECRET_KEY,
  MAPPLS_REST_API_KEY,
} from "@/constants/links";
import AddAddressDetail from "./AddAddressDetail";
import { commonStyles } from "@/constants/commonStyles";
import { useMutation } from "@tanstack/react-query";
import { verifyCustomerAddressLocation } from "@/service/userService";
import { useSafeLocation } from "@/utils/helpers";
import MapDetailLoader from "@/components/Loader/MapDetailLoader";

const { MapView, Camera, RestApi, UserLocation } = MapplsGL;

const AddAddress = () => {
  const { latitude, longitude } = useSafeLocation();
  const [markerCoordinates, setMarkerCoordinates] = useState<number[]>([0, 0]);
  const [mapplsPin, setMapplsPin] = useState("");
  const [locationDetails, setLocationDetails] =
    useState<LocationAddressProps>();
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [addressData, setAddressData] = useState<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [locationInitialized, setLocationInitialized] = useState(false);

  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const addAddressSheetRef = useRef<BottomSheet>(null);

  const addAddressSnapPoints = useMemo(() => ["58%"], []);

  // Initialize MapplsGL SDK only once
  useEffect(() => {
    const initMapSDK = async () => {
      await MapplsGL.setMapSDKKey(MAPPLS_REST_API_KEY);
      await MapplsGL.setRestAPIKey(MAPPLS_REST_API_KEY);
      await MapplsGL.setAtlasClientId(MAPPLS_CLIENT_ID);
      await MapplsGL.setAtlasClientSecret(MAPPLS_CLIENT_SECRET_KEY);
    };
    initMapSDK();
  }, []);

  // Update marker coordinates only after we have valid location
  useEffect(() => {
    if (latitude && longitude && !locationInitialized) {
      setMarkerCoordinates([longitude, latitude]);
      setLocationInitialized(true);
    }
  }, [latitude, longitude, locationInitialized]);

  // Ensure map camera updates once both map is ready and we have coordinates
  useEffect(() => {
    if (
      mapReady &&
      locationInitialized &&
      markerCoordinates[0] !== 0 &&
      markerCoordinates[1] !== 0
    ) {
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: markerCoordinates,
          zoomLevel: 15,
          animationDuration: 1000,
        });
      }
      reverseGeocode(markerCoordinates);
    }
  }, [mapReady, locationInitialized, markerCoordinates]);

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
        setAddressData({
          latitude,
          longitude,
          area: result.locality || "",
        });
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
        console.log("Search Result:", res.eLocation);
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
        console.log("Location fetch failed");
        setLoading(false);
        return false;
      }

      const { latitude, longitude } = location.coords;
      const newCoords = [longitude, latitude];
      setMarkerCoordinates(newCoords);
      setLocationInitialized(true);

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

  // Request location permission on mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const verifyLocationMutation = useMutation({
    mutationKey: ["verify-location"],
    mutationFn: () =>
      verifyCustomerAddressLocation(markerCoordinates[1], markerCoordinates[0]),
    onSuccess: (data) => {
      if (data) {
        addAddressSheetRef.current?.expand();
      } else {
        if (Platform.OS === "android") {
          ToastAndroid.showWithGravity(
            "Sorry we're not currently delivering to this location",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        } else {
          Alert.alert(
            "",
            "Sorry we're not currently delivering to this location"
          );
        }
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
            {/* Camera Position */}
            <Camera
              ref={cameraRef}
              zoomLevel={zoomLevel}
              centerCoordinate={markerCoordinates}
              centerMapplsPin={mapplsPin}
              animationMode="flyTo"
              animationDuration={1000}
              minZoomLevel={4}
              maxZoomLevel={20}
            />

            {/* Add UserLocation component */}
            <UserLocation
              visible={true}
              animated={true}
              showsUserHeadingIndicator={true}
            />
          </MapView>

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
          <View style={styles.searchButton}>
            <Pressable
              onPress={handleSearch}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: scale(35),
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
        ref={addAddressSheetRef}
        index={-1}
        snapPoints={addAddressSnapPoints}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <AddAddressDetail
          addAddressSheetRef={addAddressSheetRef}
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
});

export default AddAddress;
