import AddStoreDetail from "@/components/BottomSheets/customOrder/AddStoreDetail";
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
import { LocationAddressProps } from "@/types";
import { useSafeLocation } from "@/utils/helpers";
import { scale, verticalScale } from "@/utils/styling";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import MapplsGL from "mappls-map-react-native";
import MapplsUIWidgets from "mappls-search-widgets-react-native";
import { CaretLeft, GpsFix, MagnifyingGlass } from "phosphor-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

const { MapView, Camera, RestApi, UserLocation } = MapplsGL;

const CustomOrderMap = () => {
  const addStoreSheetRef = useRef<BottomSheet>(null);

  const addStoreSnapPoints = useMemo(() => ["38%"], []);

  const { latitude, longitude } = useSafeLocation();
  const [markerCoordinates, setMarkerCoordinates] = useState<number[]>([0, 0]);
  const [mapplsPin, setMapplsPin] = useState("");
  const [locationDetails, setLocationDetails] =
    useState<LocationAddressProps>();
  const [shopData, setShopData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [mapReady, setMapReady] = useState(false);
  const [locationInitialized, setLocationInitialized] = useState(false);

  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const initMapSDK = async () => {
      await MapplsGL.setMapSDKKey(MAPPLS_REST_API_KEY);
      await MapplsGL.setRestAPIKey(MAPPLS_REST_API_KEY);
      await MapplsGL.setAtlasClientId(MAPPLS_CLIENT_ID);
      await MapplsGL.setAtlasClientSecret(MAPPLS_CLIENT_SECRET_KEY);
    };
    initMapSDK();
  }, []);

  useEffect(() => {
    if (latitude && longitude && !locationInitialized) {
      setMarkerCoordinates([longitude, latitude]);
      setLocationInitialized(true);
    }
  }, [latitude, longitude, locationInitialized]);

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

      // Format: longitude,latitude
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
        setShopData({
          shopName: result.formatted_address,
          place: result.locality,
          latitude,
          longitude,
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

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
                console.log("Map moved to:", latitude, longitude);
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
                Product purchase location
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
            />
          </View>

          {/* Search Button */}
          <View
            style={{
              position: "absolute",
              top: 20,
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
                    title="Add Store detail"
                    onPress={() => addStoreSheetRef.current?.expand()}
                    style={styles.button}
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
        ref={addStoreSheetRef}
        index={-1}
        snapPoints={addStoreSnapPoints}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <AddStoreDetail
          addStoreSheetRef={addStoreSheetRef}
          shopData={shopData}
        />
      </BottomSheet>
    </>
  );
};

export default CustomOrderMap;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    marginTop: verticalScale(20),
  },
  button: {
    width: SCREEN_WIDTH * 0.9,
    marginVertical: verticalScale(10),
  },
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
    top: "125%",
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
