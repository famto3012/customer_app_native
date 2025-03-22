import { StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/store";
import MapplsGL from "mappls-map-react-native";
import {
  MAPPLS_CLIENT_ID,
  MAPPLS_CLIENT_SECRET_KEY,
  MAPPLS_REST_API_KEY,
} from "@/constants/links";
import { scale } from "@/utils/styling";
import ScreenWrapper from "../ScreenWrapper";
import axios from "axios";
import { useSocket } from "@/service/socketProvider";
import { useSafeLocation } from "@/utils/helpers";
import { HouseLine, Storefront } from "phosphor-react-native";
import { colors } from "@/constants/theme";

const {
  MapView,
  Camera,
  UserLocation,
  ShapeSource,
  LineLayer,
  SymbolLayer,
  PointAnnotation,
} = MapplsGL;

interface MapProps {
  pickupLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
  orderId: string;
}

const Map = ({ pickupLocation, deliveryLocation, orderId }: MapProps) => {
  const { latitude, longitude } = useSafeLocation();
  const [initialCoordinates, setInitialCoordinates] = useState<number[]>([
    longitude,
    latitude,
  ]);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [agentLocation, setAgentLocation] = useState<any>(null);

  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const socket = useSocket();

  useEffect(() => {
    if (!socket || !orderId) return;

    // Function to emit event every 1 min
    const emitAgentLocationUpdate = () => {
      console.log("Emitting agentLocationUpdateForUser for order:", orderId);
      socket.emit("agentLocationUpdateForUser", { orderId });
    };

    // Emit immediately and set an interval
    emitAgentLocationUpdate();
    const interval = setInterval(emitAgentLocationUpdate, 60000); // Every 1 minute

    // Listener for agent location updates
    const handleAgentLocationUpdate = (data: any) => {
      console.log("Received agentCurrentLocation:", data);
      if (data.agentLocation) {
        setAgentLocation([data.agentLocation[1], data.agentLocation[0]]);
      }
    };

    socket.on("agentCurrentLocation", handleAgentLocationUpdate);

    // Cleanup function
    return () => {
      clearInterval(interval);
      socket.off("agentCurrentLocation", handleAgentLocationUpdate);
    };
  }, [socket, orderId]);

  // Convert pickup and delivery locations to format required by MapplsGL
  const pickupCoordinates = [pickupLocation.longitude, pickupLocation.latitude];
  const deliveryCoordinates = [
    deliveryLocation.longitude,
    deliveryLocation.latitude,
  ];

  // Create GeoJSON for markers
  const pickupMarker = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "pickup",
        properties: {
          id: "pickup",
          title: "Pickup",
        },
        geometry: {
          type: "Point",
          coordinates: pickupCoordinates,
        },
      },
    ],
  };

  const agentMarker = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "agent",
        properties: {
          id: "agent",
          title: "agent",
        },
        geometry: {
          type: "Point",
          coordinates: agentLocation,
        },
      },
    ],
  };

  const deliveryMarker = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "delivery",
        properties: {
          id: "delivery",
          title: "Delivery",
        },
        geometry: {
          type: "Point",
          coordinates: deliveryCoordinates,
        },
      },
    ],
  };

  // Create GeoJSON for the route line (will be updated with directions API response)
  const routeLine = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routeCoordinates.length > 0 ? routeCoordinates : [],
        },
      },
    ],
  };

  useEffect(() => {
    MapplsGL.setMapSDKKey(MAPPLS_REST_API_KEY);
    MapplsGL.setRestAPIKey(MAPPLS_REST_API_KEY);
    MapplsGL.setAtlasClientId(MAPPLS_CLIENT_ID);
    MapplsGL.setAtlasClientSecret(MAPPLS_CLIENT_SECRET_KEY);
  }, []);

  // Fetch directions using Mappls Direction API
  useEffect(() => {
    const getRouteCoordinates = async (pickup: any, drop: any) => {
      try {
        const url = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_API_KEY}/route_adv/biking/${pickup.longitude},${pickup.latitude};${drop.longitude},${drop.latitude}?geometries=geojson`;

        const response = await axios.get(url);
        if (
          response.data &&
          response.data.routes &&
          response.data.routes.length > 0
        ) {
          const route = response.data.routes[0].geometry; // Encoded polyline
          setRouteCoordinates(route.coordinates);
          // return decodePolyline(route); // Decode to array of lat/lng
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        return [];
      }
    };

    // Only fetch directions if both locations are valid
    if (
      pickupLocation.latitude &&
      pickupLocation.longitude &&
      deliveryLocation.latitude &&
      deliveryLocation.longitude
    ) {
      getRouteCoordinates(pickupLocation, deliveryLocation);
    }
  }, [pickupLocation, deliveryLocation]);

  // Calculate bounds for camera to fit both points
  useEffect(() => {
    // Set timeout to ensure map is ready
    const timer = setTimeout(() => {
      if (cameraRef.current) {
        // Calculate the center point between pickup and delivery
        const centerLng = (pickupCoordinates[0] + deliveryCoordinates[0]) / 2;
        const centerLat = (pickupCoordinates[1] + deliveryCoordinates[1]) / 2;

        // Set initial coordinates to the center
        setInitialCoordinates([centerLng, centerLat]);

        // Fly to a zoom level that shows both points
        cameraRef.current.fitBounds(
          [
            Math.min(pickupCoordinates[0], deliveryCoordinates[0]),
            Math.min(pickupCoordinates[1], deliveryCoordinates[1]),
          ],
          [
            Math.max(pickupCoordinates[0], deliveryCoordinates[0]),
            Math.max(pickupCoordinates[1], deliveryCoordinates[1]),
          ],
          50, // padding
          1000 // animation duration
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pickupCoordinates, deliveryCoordinates]);

  return (
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
          logoPosition={{ bottom: -150, left: -150 }}
          onRegionDidChange={(event) => {
            const { properties } = event;
            if (properties && properties.zoomLevel) {
              setZoomLevel(properties.zoomLevel);
            }
          }}
        >
          {/* Camera Position */}
          <Camera
            ref={cameraRef}
            zoomLevel={zoomLevel}
            centerCoordinate={initialCoordinates}
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

          {/* Route Line between pickup and delivery */}
          <ShapeSource id="routeSource" shape={routeLine}>
            <LineLayer
              id="routeLine"
              style={{
                lineColor: "#00CED1",
                lineWidth: 5,
                lineOpacity: 0.8,
              }}
            />
          </ShapeSource>

          {/* Pickup Marker */}
          {/* <ShapeSource id="pickupSource" shape={pickupMarker}>
            <SymbolLayer
              id="pickupSymbol"
              style={{
                iconImage: require("@/assets/images/pickup-marker.webp"),
                iconSize: 0.03,
                iconAllowOverlap: true,
              }}
            />
          </ShapeSource> */}
          <PointAnnotation id="pickupAnnotation" coordinate={pickupCoordinates}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: scale(35),
                height: scale(35),
                borderRadius: scale(30),
                backgroundColor: colors.NEUTRAL900,
                borderWidth: 2,
                borderColor: colors.WHITE,
                // padding: 1,
              }}
            >
              <Storefront color={colors.WHITE} size={28} weight="duotone" />
            </View>
          </PointAnnotation>

          {/* Delivery Marker */}
          {/* <ShapeSource id="deliverySource" shape={deliveryMarker}>
            <SymbolLayer
              id="deliverySymbol"
              style={{
                iconImage: require("@/assets/images/delivery-marker.webp"),
                iconSize: 0.15,
                iconAllowOverlap: true,
              }}
            />
          </ShapeSource> */}
          <PointAnnotation id="pickupAnnotation" coordinate={pickupCoordinates}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: scale(35),
                height: scale(35),
                borderRadius: scale(30),
                backgroundColor: colors.NEUTRAL900,
                borderWidth: 2,
                borderColor: colors.WHITE,
                // padding: 1,
              }}
            >
              <HouseLine color={colors.WHITE} size={28} weight="duotone" />
            </View>
          </PointAnnotation>

          <ShapeSource id="agentSource" shape={agentMarker}>
            <SymbolLayer
              id="agentSymbol"
              style={{
                iconImage: require("@/assets/images/agent-marker.webp"),
                iconSize: 0.15,
                iconAllowOverlap: true,
              }}
            />
          </ShapeSource>
        </MapView>
      </View>
    </ScreenWrapper>
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
});

export default Map;
// import { StyleSheet, View, Platform, ActivityIndicator, Image } from "react-native";
// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import MapplsGL from "mappls-map-react-native";
// import {
//   MAPPLS_CLIENT_ID,
//   MAPPLS_CLIENT_SECRET_KEY,
//   MAPPLS_REST_API_KEY,
// } from "@/constants/links";
// import { scale } from "@/utils/styling";
// import ScreenWrapper from "../ScreenWrapper";
// import axios from "axios";
// import { useSocket } from "@/service/socketProvider";
// import { useSafeLocation } from "@/utils/helpers";

// const { MapView, Camera, UserLocation, ShapeSource, LineLayer, SymbolLayer } =
//   MapplsGL;

// // Configuration based on build type
// const CONFIG = {
//   SOCKET_INTERVAL: __DEV__ ? 60000 : 180000, // 1 min for debug, 3 min for release
//   MAP_ANIMATION_DURATION: __DEV__ ? 1000 : 500, // Shorter animations in production
//   HTTP_TIMEOUT: __DEV__ ? 15000 : 8000, // Shorter timeouts in production
//   CAMERA_PADDING: 100, // Padding for camera bounds
//   MAP_INIT_DELAY: 300, // Delay before initializing map
//   DEFAULT_ZOOM: 12, // Default zoom level
// };

// // Default coordinates for safety
// const DEFAULT_COORDINATES = [77.2090, 28.6139]; // Delhi coordinates as fallback

// interface MapProps {
//   pickupLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   deliveryLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   orderId: string;
// }

// const Map = ({ pickupLocation, deliveryLocation, orderId }: MapProps) => {
//   const { latitude, longitude } = useSafeLocation();
//   const [mapReady, setMapReady] = useState(false);
//   const [initialCoordinates, setInitialCoordinates] = useState<number[]>([
//     longitude || DEFAULT_COORDINATES[0],
//     latitude || DEFAULT_COORDINATES[1],
//   ]);
//   const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
//   const [zoomLevel, setZoomLevel] = useState(CONFIG.DEFAULT_ZOOM);
//   const [agentLocation, setAgentLocation] = useState<number[] | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [markersLoaded, setMarkersLoaded] = useState(false);

//   const cameraRef = useRef<any>(null);
//   const mapRef = useRef<any>(null);
//   const routeFetchedRef = useRef(false);
//   const socketUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const mountedRef = useRef(true);

//   const socket = useSocket();

//   // Pre-load marker images to prevent rendering issues
//   const pickupMarkerImage = useMemo(() => require("@/assets/images/pickup-marker.webp"), []);
//   const deliveryMarkerImage = useMemo(() => require("@/assets/images/delivery-marker.webp"), []);
//   const agentMarkerImage = useMemo(() => require("@/assets/images/agent-marker.webp"), []);

//   // Preload images to avoid rendering issues
//   useEffect(() => {
//     const preloadImages = async () => {
//       try {
//         // Force image preloading
//         await Promise.all([
//           Image.prefetch(Image.resolveAssetSource(pickupMarkerImage).uri),
//           Image.prefetch(Image.resolveAssetSource(deliveryMarkerImage).uri),
//           Image.prefetch(Image.resolveAssetSource(agentMarkerImage).uri)
//         ]);

//         if (mountedRef.current) {
//           setMarkersLoaded(true);
//         }
//       } catch (error) {
//         console.error("Failed to preload marker images:", error);
//         // Continue anyway
//         if (mountedRef.current) {
//           setMarkersLoaded(true);
//         }
//       }
//     };

//     preloadImages();
//   }, [pickupMarkerImage, deliveryMarkerImage, agentMarkerImage]);

//   // Initialize MapplsGL - only once
//   useEffect(() => {
//     mountedRef.current = true;

//     const initializeMap = async () => {
//       try {
//         await MapplsGL.setMapSDKKey(MAPPLS_REST_API_KEY);
//         await MapplsGL.setRestAPIKey(MAPPLS_REST_API_KEY);
//         await MapplsGL.setAtlasClientId(MAPPLS_CLIENT_ID);
//         await MapplsGL.setAtlasClientSecret(MAPPLS_CLIENT_SECRET_KEY);

//         if (mountedRef.current) {
//           setMapReady(true);
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error("Failed to initialize MapplsGL:", error);
//         if (mountedRef.current) {
//           setIsLoading(false);
//         }
//       }
//     };

//     // Slight delay to ensure native modules are ready
//     const timer = setTimeout(() => {
//       initializeMap();
//     }, CONFIG.MAP_INIT_DELAY);

//     return () => {
//       mountedRef.current = false;
//       clearTimeout(timer);
//     };
//   }, []);

//   // Socket connection management with optimized interval
//   useEffect(() => {
//     if (!socket || !orderId || !mapReady) return;

//     let lastUpdateTime = 0;

//     // Function to emit event with throttling
//     const emitAgentLocationUpdate = () => {
//       const now = Date.now();
//       // Only update if sufficient time has passed
//       if (now - lastUpdateTime > CONFIG.SOCKET_INTERVAL) {
//         if (mountedRef.current) {
//           console.log("Emitting agentLocationUpdateForUser for order:", orderId);
//           socket.emit("agentLocationUpdateForUser", { orderId });
//           lastUpdateTime = now;
//         }
//       }
//     };

//     // Initial emit
//     emitAgentLocationUpdate();

//     // Set interval with safer approach
//     const interval = setInterval(emitAgentLocationUpdate, CONFIG.SOCKET_INTERVAL);
//     socketUpdateTimerRef.current = interval;

//     // Optimized listener with error handling
//     const handleAgentLocationUpdate = (data: any) => {
//       try {
//         if (data?.agentLocation &&
//             Array.isArray(data.agentLocation) &&
//             data.agentLocation.length === 2 &&
//             !isNaN(data.agentLocation[0]) &&
//             !isNaN(data.agentLocation[1]) &&
//             mountedRef.current) {
//           setAgentLocation([data.agentLocation[1], data.agentLocation[0]]);
//         }
//       } catch (error) {
//         console.error("Error handling agent location update:", error);
//       }
//     };

//     // Add socket listeners with error handling
//     socket.on("agentCurrentLocation", handleAgentLocationUpdate);
//     socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error);
//     });

//     // Cleanup function
//     return () => {
//       if (socketUpdateTimerRef.current) {
//         clearInterval(socketUpdateTimerRef.current);
//         socketUpdateTimerRef.current = null;
//       }
//       socket.off("agentCurrentLocation", handleAgentLocationUpdate);
//       socket.off("connect_error");
//     };
//   }, [socket, orderId, mapReady]);

//   // Validate location data to prevent crashes
//   const safePickupLocation = useMemo(() => ({
//     latitude: pickupLocation?.latitude || DEFAULT_COORDINATES[1],
//     longitude: pickupLocation?.longitude || DEFAULT_COORDINATES[0],
//   }), [pickupLocation]);

//   const safeDeliveryLocation = useMemo(() => ({
//     latitude: deliveryLocation?.latitude || DEFAULT_COORDINATES[1],
//     longitude: deliveryLocation?.longitude || DEFAULT_COORDINATES[0],
//   }), [deliveryLocation]);

//   // Memoize coordinate transformations to avoid unnecessary recalculations
//   const pickupCoordinates = useMemo(() =>
//     [safePickupLocation.longitude, safePickupLocation.latitude],
//     [safePickupLocation.longitude, safePickupLocation.latitude]
//   );

//   const deliveryCoordinates = useMemo(() =>
//     [safeDeliveryLocation.longitude, safeDeliveryLocation.latitude],
//     [safeDeliveryLocation.longitude, safeDeliveryLocation.latitude]
//   );

//   // Memoize GeoJSON objects to prevent unnecessary rerenders
//   const pickupMarker = useMemo(() => ({
//     type: "FeatureCollection",
//     features: [
//       {
//         type: "Feature",
//         id: "pickup",
//         properties: {
//           id: "pickup",
//           title: "Pickup",
//         },
//         geometry: {
//           type: "Point",
//           coordinates: pickupCoordinates,
//         },
//       },
//     ],
//   }), [pickupCoordinates]);

//   const deliveryMarker = useMemo(() => ({
//     type: "FeatureCollection",
//     features: [
//       {
//         type: "Feature",
//         id: "delivery",
//         properties: {
//           id: "delivery",
//           title: "Delivery",
//         },
//         geometry: {
//           type: "Point",
//           coordinates: deliveryCoordinates,
//         },
//       },
//     ],
//   }), [deliveryCoordinates]);

//   // Only create agent marker when location is valid
//   const agentMarker = useMemo(() => {
//     if (!agentLocation || !Array.isArray(agentLocation) || agentLocation.length !== 2) {
//       return null;
//     }

//     return {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           id: "agent",
//           properties: {
//             id: "agent",
//             title: "Agent",
//           },
//           geometry: {
//             type: "Point",
//             coordinates: agentLocation,
//           },
//         },
//       ],
//     };
//   }, [agentLocation]);

//   const routeLine = useMemo(() => ({
//     type: "FeatureCollection",
//     features: [
//       {
//         type: "Feature",
//         properties: {},
//         geometry: {
//           type: "LineString",
//           coordinates: routeCoordinates.length > 1 ? routeCoordinates : [],
//         },
//       },
//     ],
//   }), [routeCoordinates]);

//   // Optimized route fetching with retry and timeout
//   const getRouteCoordinates = useCallback(async (pickup: any, drop: any, retryCount = 0) => {
//     if (routeFetchedRef.current || !mountedRef.current) return; // Prevent duplicate fetches

//     try {
//       setIsLoading(true);
//       const url = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_API_KEY}/route_adv/biking/${pickup.longitude},${pickup.latitude};${drop.longitude},${drop.latitude}?geometries=geojson`;

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), CONFIG.HTTP_TIMEOUT);

//       const response = await axios.get(url, {
//         signal: controller.signal,
//         headers: { 'Cache-Control': 'no-cache' }
//       });

//       clearTimeout(timeoutId);

//       if (response.data?.routes?.[0]?.geometry?.coordinates &&
//           Array.isArray(response.data.routes[0].geometry.coordinates) &&
//           response.data.routes[0].geometry.coordinates.length > 0) {
//         if (mountedRef.current) {
//           setRouteCoordinates(response.data.routes[0].geometry.coordinates);
//           routeFetchedRef.current = true;
//           setIsLoading(false);
//         }
//       } else {
//         throw new Error("Invalid route data received");
//       }
//     } catch (error) {
//       console.error(`Error fetching route (attempt ${retryCount + 1}):`, error);

//       // Retry logic with exponential backoff (max 2 retries)
//       if (retryCount < 2 && mountedRef.current) {
//         setTimeout(() => {
//           getRouteCoordinates(pickup, drop, retryCount + 1);
//         }, 1000 * Math.pow(2, retryCount)); // 1s, 2s, 4s backoff
//       } else if (mountedRef.current) {
//         setIsLoading(false);
//       }
//     }
//   }, []);

//   // Fetch route only when coordinates are available and map is ready
//   useEffect(() => {
//     if (!mapReady || routeFetchedRef.current) return;

//     if (
//       safePickupLocation?.latitude &&
//       safePickupLocation?.longitude &&
//       safeDeliveryLocation?.latitude &&
//       safeDeliveryLocation?.longitude
//     ) {
//       getRouteCoordinates(safePickupLocation, safeDeliveryLocation);
//     }
//   }, [safePickupLocation, safeDeliveryLocation, mapReady, getRouteCoordinates]);

//   // Optimized camera positioning
//   useEffect(() => {
//     if (!mapReady || !cameraRef.current) return;

//     const timer = setTimeout(() => {
//       try {
//         if (!mountedRef.current) return;

//         // Calculate the center point between pickup and delivery
//         const centerLng = (pickupCoordinates[0] + deliveryCoordinates[0]) / 2;
//         const centerLat = (pickupCoordinates[1] + deliveryCoordinates[1]) / 2;

//         // Set initial coordinates to the center
//         setInitialCoordinates([centerLng, centerLat]);

//         // Fit bounds with proper error handling
//         if (cameraRef.current &&
//             !isNaN(pickupCoordinates[0]) &&
//             !isNaN(deliveryCoordinates[0]) &&
//             !isNaN(pickupCoordinates[1]) &&
//             !isNaN(deliveryCoordinates[1])) {
//           cameraRef.current.fitBounds(
//             [
//               Math.min(pickupCoordinates[0], deliveryCoordinates[0]),
//               Math.min(pickupCoordinates[1], deliveryCoordinates[1]),
//             ],
//             [
//               Math.max(pickupCoordinates[0], deliveryCoordinates[0]),
//               Math.max(pickupCoordinates[1], deliveryCoordinates[1]),
//             ],
//             CONFIG.CAMERA_PADDING,
//             CONFIG.MAP_ANIMATION_DURATION
//           );
//         } else {
//           // Fallback if coordinates are invalid
//           setZoomLevel(CONFIG.DEFAULT_ZOOM);
//         }
//       } catch (error) {
//         console.error("Error positioning camera:", error);
//         // Fallback to center coordinates if bounds calculation fails
//         if (mountedRef.current) {
//           setZoomLevel(CONFIG.DEFAULT_ZOOM);
//         }
//       }
//     }, 1000); // Give more time for map to initialize

//     return () => clearTimeout(timer);
//   }, [pickupCoordinates, deliveryCoordinates, mapReady]);

//   // Manual camera update function instead of using onRegionDidChange
//   const handleMapPress = useCallback(() => {
//     // Skip camera updates on user interaction
//     // This avoids the stutter issue with onRegionDidChange
//     console.log("Map interaction detected");
//   }, []);

//   // Error boundary for the map
//   const handleMapError = useCallback((error: any) => {
//     console.error("Map error:", error);
//     // Reset map state on error
//     if (mountedRef.current) {
//       setMapReady(false);
//       setIsLoading(true);

//       // Attempt to re-initialize after a delay
//       setTimeout(() => {
//         if (mountedRef.current) {
//           setMapReady(true);
//           setIsLoading(false);
//         }
//       }, 2000);
//     }
//   }, []);

//   // Cleanup resources on unmount
//   useEffect(() => {
//     return () => {
//       mountedRef.current = false;
//       setRouteCoordinates([]);
//       setAgentLocation(null);
//       routeFetchedRef.current = false;

//       if (socketUpdateTimerRef.current) {
//         clearInterval(socketUpdateTimerRef.current);
//         socketUpdateTimerRef.current = null;
//       }
//     };
//   }, []);

//   // Show loading indicator while map initializes
//   if (isLoading && !mapReady) {
//     return (
//       <ScreenWrapper>
//         <View style={[styles.container, styles.loadingContainer]}>
//           <ActivityIndicator size="large" color="#00CED1" />
//         </View>
//       </ScreenWrapper>
//     );
//   }

//   return (
//     <ScreenWrapper>
//       <View style={styles.container}>
//         {mapReady ? (
//           <MapView
//             ref={mapRef}
//             style={styles.map}
//             zoomEnabled={true}
//             scrollEnabled={true}
//             pitchEnabled={true}
//             rotateEnabled={true}
//             compassEnabled={true}
//             attributionEnabled={true}
//             logoPosition={{ bottom: -150, left: -150 }}
//             onPress={handleMapPress}
//             onError={handleMapError}
//           >
//             {/* Camera Position */}
//             <Camera
//               ref={cameraRef}
//               zoomLevel={zoomLevel}
//               centerCoordinate={initialCoordinates}
//               animationMode={__DEV__ ? "flyTo" : "moveTo"} // Simpler animation in production
//               animationDuration={CONFIG.MAP_ANIMATION_DURATION}
//               minZoomLevel={4}
//               maxZoomLevel={20}
//             />

//             {/* Add UserLocation component */}
//             <UserLocation
//               visible={true}
//               animated={Platform.OS === 'ios'} // Animation can cause issues on some Android devices
//               showsUserHeadingIndicator={true}
//             />

//             {/* Route Line between pickup and delivery - only render if we have valid data */}
//             {routeCoordinates.length > 1 && (
//               <ShapeSource id="routeSource" shape={routeLine}>
//                 <LineLayer
//                   id="routeLine"
//                   style={{
//                     lineColor: "#00CED1",
//                     lineWidth: 3, // Slightly reduced for performance
//                     lineOpacity: 0.8,
//                   }}
//                 />
//               </ShapeSource>
//             )}

//             {/* Only render markers if they've been pre-loaded */}
//             {markersLoaded && (
//               <>
//                 {/* Pickup Marker */}
//                 <ShapeSource id="pickupSource" shape={pickupMarker}>
//                   <SymbolLayer
//                     id="pickupSymbol"
//                     style={{
//                       iconImage: pickupMarkerImage,
//                       iconSize: 0.03,
//                       iconAllowOverlap: true,
//                     }}
//                   />
//                 </ShapeSource>

//                 {/* Delivery Marker */}
//                 <ShapeSource id="deliverySource" shape={deliveryMarker}>
//                   <SymbolLayer
//                     id="deliverySymbol"
//                     style={{
//                       iconImage: deliveryMarkerImage,
//                       iconSize: 0.15,
//                       iconAllowOverlap: true,
//                     }}
//                   />
//                 </ShapeSource>

//                 {/* Agent Marker - only render when data is available and valid */}
//                 {agentLocation &&
//                  Array.isArray(agentLocation) &&
//                  agentLocation.length === 2 &&
//                  !isNaN(agentLocation[0]) &&
//                  !isNaN(agentLocation[1]) &&
//                  agentMarker && (
//                   <ShapeSource id="agentSource" shape={agentMarker}>
//                     <SymbolLayer
//                       id="agentSymbol"
//                       style={{
//                         iconImage: agentMarkerImage,
//                         iconSize: 0.15,
//                         iconAllowOverlap: true,
//                       }}
//                     />
//                   </ShapeSource>
//                 )}
//               </>
//             )}
//           </MapView>
//         ) : (
//           <View style={[styles.map, styles.loadingContainer]}>
//             <ActivityIndicator size="large" color="#00CED1" />
//           </View>
//         )}
//       </View>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: scale(-20),
//   },
//   map: {
//     flex: 1,
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   }
// });

// export default Map;
// import {
//   StyleSheet,
//   View,
//   Platform,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import MapplsGL from "mappls-map-react-native";
// import {
//   MAPPLS_CLIENT_ID,
//   MAPPLS_CLIENT_SECRET_KEY,
//   MAPPLS_REST_API_KEY,
// } from "@/constants/links";
// import { scale } from "@/utils/styling";
// import ScreenWrapper from "../ScreenWrapper";
// import axios from "axios";
// import { useSocket } from "@/service/socketProvider";
// import { useSafeLocation } from "@/utils/helpers";

// const { MapView, Camera, UserLocation, ShapeSource, LineLayer, SymbolLayer } =
//   MapplsGL;

// // Configuration based on build type
// const CONFIG = {
//   SOCKET_INTERVAL: __DEV__ ? 60000 : 180000, // 1 min for debug, 3 min for release
//   MAP_ANIMATION_DURATION: __DEV__ ? 1000 : 500, // Shorter animations in production
//   HTTP_TIMEOUT: __DEV__ ? 15000 : 8000, // Shorter timeouts in production
//   CAMERA_PADDING: 100, // Padding for camera bounds
//   MAP_INIT_DELAY: 300, // Delay before initializing map
//   DEFAULT_ZOOM: 12, // Default zoom level
// };

// // Default coordinates for safety
// const DEFAULT_COORDINATES = [77.209, 28.6139]; // Delhi coordinates as fallback

// interface MapProps {
//   pickupLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   deliveryLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   orderId: string;
// }

// const Map = ({ pickupLocation, deliveryLocation, orderId }: MapProps) => {
//   const { latitude, longitude } = useSafeLocation();
//   const [mapReady, setMapReady] = useState(false);
//   const [initialCoordinates, setInitialCoordinates] = useState<number[]>([
//     longitude || DEFAULT_COORDINATES[0],
//     latitude || DEFAULT_COORDINATES[1],
//   ]);
//   const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
//   const [zoomLevel, setZoomLevel] = useState(CONFIG.DEFAULT_ZOOM);
//   const [agentLocation, setAgentLocation] = useState<number[] | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [markersLoaded, setMarkersLoaded] = useState(false);

//   const cameraRef = useRef<any>(null);
//   const mapRef = useRef<any>(null);
//   const routeFetchedRef = useRef(false);
//   const socketUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const mountedRef = useRef(true);

//   const socket = useSocket();

//   // Pre-load marker images to prevent rendering issues
//   const pickupMarkerImage = useMemo(
//     () => require("@/assets/images/pickup-marker.webp"),
//     []
//   );
//   const deliveryMarkerImage = useMemo(
//     () => require("@/assets/images/delivery-marker.webp"),
//     []
//   );
//   const agentMarkerImage = useMemo(
//     () => require("@/assets/images/agent-marker.webp"),
//     []
//   );

//   // Preload images to avoid rendering issues
//   useEffect(() => {
//     const preloadImages = async () => {
//       try {
//         // Force image preloading
//         await Promise.all([
//           Image.prefetch(Image.resolveAssetSource(pickupMarkerImage).uri),
//           Image.prefetch(Image.resolveAssetSource(deliveryMarkerImage).uri),
//           Image.prefetch(Image.resolveAssetSource(agentMarkerImage).uri),
//         ]);

//         if (mountedRef.current) {
//           setMarkersLoaded(true);
//         }
//       } catch (error) {
//         console.error("Failed to preload marker images:", error);
//         // Continue anyway
//         if (mountedRef.current) {
//           setMarkersLoaded(true);
//         }
//       }
//     };

//     preloadImages();
//   }, [pickupMarkerImage, deliveryMarkerImage, agentMarkerImage]);

//   // Initialize MapplsGL - only once
//   useEffect(() => {
//     mountedRef.current = true;

//     const initializeMap = async () => {
//       try {
//         await MapplsGL.setMapSDKKey(MAPPLS_REST_API_KEY);
//         await MapplsGL.setRestAPIKey(MAPPLS_REST_API_KEY);
//         await MapplsGL.setAtlasClientId(MAPPLS_CLIENT_ID);
//         await MapplsGL.setAtlasClientSecret(MAPPLS_CLIENT_SECRET_KEY);

//         if (mountedRef.current) {
//           setMapReady(true);
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error("Failed to initialize MapplsGL:", error);
//         if (mountedRef.current) {
//           setIsLoading(false);
//         }
//       }
//     };

//     // Slight delay to ensure native modules are ready
//     const timer = setTimeout(() => {
//       initializeMap();
//     }, CONFIG.MAP_INIT_DELAY);

//     return () => {
//       mountedRef.current = false;
//       clearTimeout(timer);
//     };
//   }, []);

//   // Socket connection management with optimized interval
//   useEffect(() => {
//     if (!socket || !orderId || !mapReady) return;

//     let lastUpdateTime = 0;

//     // Function to emit event with throttling
//     const emitAgentLocationUpdate = () => {
//       const now = Date.now();
//       // Only update if sufficient time has passed
//       if (now - lastUpdateTime > CONFIG.SOCKET_INTERVAL) {
//         if (mountedRef.current) {
//           console.log(
//             "Emitting agentLocationUpdateForUser for order:",
//             orderId
//           );
//           socket.emit("agentLocationUpdateForUser", { orderId });
//           lastUpdateTime = now;
//         }
//       }
//     };

//     // Initial emit
//     emitAgentLocationUpdate();

//     // Set interval with safer approach
//     const interval = setInterval(
//       emitAgentLocationUpdate,
//       CONFIG.SOCKET_INTERVAL
//     );
//     socketUpdateTimerRef.current = interval;

//     // Optimized listener with error handling
//     const handleAgentLocationUpdate = (data: any) => {
//       try {
//         if (
//           data?.agentLocation &&
//           Array.isArray(data.agentLocation) &&
//           data.agentLocation.length === 2 &&
//           !isNaN(data.agentLocation[0]) &&
//           !isNaN(data.agentLocation[1]) &&
//           mountedRef.current
//         ) {
//           setAgentLocation([data.agentLocation[1], data.agentLocation[0]]);
//         }
//       } catch (error) {
//         console.error("Error handling agent location update:", error);
//       }
//     };

//     // Add socket listeners with error handling
//     socket.on("agentCurrentLocation", handleAgentLocationUpdate);
//     socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error);
//     });

//     // Cleanup function
//     return () => {
//       if (socketUpdateTimerRef.current) {
//         clearInterval(socketUpdateTimerRef.current);
//         socketUpdateTimerRef.current = null;
//       }
//       socket.off("agentCurrentLocation", handleAgentLocationUpdate);
//       socket.off("connect_error");
//     };
//   }, [socket, orderId, mapReady]);

//   // Validate location data to prevent crashes
//   const safePickupLocation = useMemo(
//     () => ({
//       latitude: pickupLocation?.latitude || DEFAULT_COORDINATES[1],
//       longitude: pickupLocation?.longitude || DEFAULT_COORDINATES[0],
//     }),
//     [pickupLocation]
//   );

//   const safeDeliveryLocation = useMemo(
//     () => ({
//       latitude: deliveryLocation?.latitude || DEFAULT_COORDINATES[1],
//       longitude: deliveryLocation?.longitude || DEFAULT_COORDINATES[0],
//     }),
//     [deliveryLocation]
//   );

//   // Memoize coordinate transformations to avoid unnecessary recalculations
//   const pickupCoordinates = useMemo(
//     () => [safePickupLocation.longitude, safePickupLocation.latitude],
//     [safePickupLocation.longitude, safePickupLocation.latitude]
//   );

//   const deliveryCoordinates = useMemo(
//     () => [safeDeliveryLocation.longitude, safeDeliveryLocation.latitude],
//     [safeDeliveryLocation.longitude, safeDeliveryLocation.latitude]
//   );

//   // Memoize GeoJSON objects to prevent unnecessary rerenders
//   const pickupMarker = useMemo(
//     () => ({
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           id: "pickup",
//           properties: {
//             id: "pickup",
//             title: "Pickup",
//           },
//           geometry: {
//             type: "Point",
//             coordinates: pickupCoordinates,
//           },
//         },
//       ],
//     }),
//     [pickupCoordinates]
//   );

//   const deliveryMarker = useMemo(
//     () => ({
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           id: "delivery",
//           properties: {
//             id: "delivery",
//             title: "Delivery",
//           },
//           geometry: {
//             type: "Point",
//             coordinates: deliveryCoordinates,
//           },
//         },
//       ],
//     }),
//     [deliveryCoordinates]
//   );

//   // Only create agent marker when location is valid
//   const agentMarker = useMemo(() => {
//     if (
//       !agentLocation ||
//       !Array.isArray(agentLocation) ||
//       agentLocation.length !== 2
//     ) {
//       return null;
//     }

//     return {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           id: "agent",
//           properties: {
//             id: "agent",
//             title: "Agent",
//           },
//           geometry: {
//             type: "Point",
//             coordinates: agentLocation,
//           },
//         },
//       ],
//     };
//   }, [agentLocation]);

//   const routeLine = useMemo(
//     () => ({
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             type: "LineString",
//             coordinates: routeCoordinates.length > 1 ? routeCoordinates : [],
//           },
//         },
//       ],
//     }),
//     [routeCoordinates]
//   );

//   // Optimized route fetching with retry and timeout
//   const getRouteCoordinates = useCallback(
//     async (pickup: any, drop: any, retryCount = 0) => {
//       if (routeFetchedRef.current || !mountedRef.current) return; // Prevent duplicate fetches

//       try {
//         setIsLoading(true);
//         const url = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_API_KEY}/route_adv/biking/${pickup.longitude},${pickup.latitude};${drop.longitude},${drop.latitude}?geometries=geojson`;

//         const controller = new AbortController();
//         const timeoutId = setTimeout(
//           () => controller.abort(),
//           CONFIG.HTTP_TIMEOUT
//         );

//         const response = await axios.get(url, {
//           signal: controller.signal,
//           headers: { "Cache-Control": "no-cache" },
//         });

//         clearTimeout(timeoutId);

//         if (
//           response.data?.routes?.[0]?.geometry?.coordinates &&
//           Array.isArray(response.data.routes[0].geometry.coordinates) &&
//           response.data.routes[0].geometry.coordinates.length > 0
//         ) {
//           if (mountedRef.current) {
//             setRouteCoordinates(response.data.routes[0].geometry.coordinates);
//             routeFetchedRef.current = true;
//             setIsLoading(false);
//           }
//         } else {
//           throw new Error("Invalid route data received");
//         }
//       } catch (error) {
//         console.error(
//           `Error fetching route (attempt ${retryCount + 1}):`,
//           error
//         );

//         // Retry logic with exponential backoff (max 2 retries)
//         if (retryCount < 2 && mountedRef.current) {
//           setTimeout(() => {
//             getRouteCoordinates(pickup, drop, retryCount + 1);
//           }, 1000 * Math.pow(2, retryCount)); // 1s, 2s, 4s backoff
//         } else if (mountedRef.current) {
//           setIsLoading(false);
//         }
//       }
//     },
//     []
//   );

//   // Fetch route only when coordinates are available and map is ready
//   useEffect(() => {
//     if (!mapReady || routeFetchedRef.current) return;

//     if (
//       safePickupLocation?.latitude &&
//       safePickupLocation?.longitude &&
//       safeDeliveryLocation?.latitude &&
//       safeDeliveryLocation?.longitude
//     ) {
//       getRouteCoordinates(safePickupLocation, safeDeliveryLocation);
//     }
//   }, [safePickupLocation, safeDeliveryLocation, mapReady, getRouteCoordinates]);

//   // Optimized camera positioning
//   useEffect(() => {
//     if (!mapReady || !cameraRef.current) return;

//     const timer = setTimeout(() => {
//       try {
//         if (!mountedRef.current) return;

//         // Calculate the center point between pickup and delivery
//         const centerLng = (pickupCoordinates[0] + deliveryCoordinates[0]) / 2;
//         const centerLat = (pickupCoordinates[1] + deliveryCoordinates[1]) / 2;

//         // Set initial coordinates to the center
//         setInitialCoordinates([centerLng, centerLat]);

//         // Fit bounds with proper error handling
//         if (
//           cameraRef.current &&
//           !isNaN(pickupCoordinates[0]) &&
//           !isNaN(deliveryCoordinates[0]) &&
//           !isNaN(pickupCoordinates[1]) &&
//           !isNaN(deliveryCoordinates[1])
//         ) {
//           cameraRef.current.fitBounds(
//             [
//               Math.min(pickupCoordinates[0], deliveryCoordinates[0]),
//               Math.min(pickupCoordinates[1], deliveryCoordinates[1]),
//             ],
//             [
//               Math.max(pickupCoordinates[0], deliveryCoordinates[0]),
//               Math.max(pickupCoordinates[1], deliveryCoordinates[1]),
//             ],
//             CONFIG.CAMERA_PADDING,
//             CONFIG.MAP_ANIMATION_DURATION
//           );
//         } else {
//           // Fallback if coordinates are invalid
//           setZoomLevel(CONFIG.DEFAULT_ZOOM);
//         }
//       } catch (error) {
//         console.error("Error positioning camera:", error);
//         // Fallback to center coordinates if bounds calculation fails
//         if (mountedRef.current) {
//           setZoomLevel(CONFIG.DEFAULT_ZOOM);
//         }
//       }
//     }, 1000); // Give more time for map to initialize

//     return () => clearTimeout(timer);
//   }, [pickupCoordinates, deliveryCoordinates, mapReady]);

//   // Manual camera update function instead of using onRegionDidChange
//   const handleMapPress = useCallback(() => {
//     // Skip camera updates on user interaction
//     // This avoids the stutter issue with onRegionDidChange
//     console.log("Map interaction detected");
//   }, []);

//   // Error boundary for the map
//   const handleMapError = useCallback((error: any) => {
//     console.error("Map error:", error);
//     // Reset map state on error
//     if (mountedRef.current) {
//       setMapReady(false);
//       setIsLoading(true);

//       // Attempt to re-initialize after a delay
//       setTimeout(() => {
//         if (mountedRef.current) {
//           setMapReady(true);
//           setIsLoading(false);
//         }
//       }, 2000);
//     }
//   }, []);

//   // Cleanup resources on unmount
//   useEffect(() => {
//     return () => {
//       mountedRef.current = false;
//       setRouteCoordinates([]);
//       setAgentLocation(null);
//       routeFetchedRef.current = false;

//       if (socketUpdateTimerRef.current) {
//         clearInterval(socketUpdateTimerRef.current);
//         socketUpdateTimerRef.current = null;
//       }
//     };
//   }, []);

//   // Show loading indicator while map initializes
//   if (isLoading && !mapReady) {
//     return (
//       <ScreenWrapper>
//         <View style={[styles.container, styles.loadingContainer]}>
//           <ActivityIndicator size="large" color="#00CED1" />
//         </View>
//       </ScreenWrapper>
//     );
//   }

//   return (
//     <ScreenWrapper>
//       <View style={styles.container}>
//         {mapReady ? (
//           <MapView
//             ref={mapRef}
//             style={styles.map}
//             zoomEnabled={true}
//             scrollEnabled={true}
//             pitchEnabled={true}
//             rotateEnabled={true}
//             compassEnabled={true}
//             attributionEnabled={true}
//             logoPosition={{ bottom: -150, left: -150 }}
//             onPress={handleMapPress}
//             onError={handleMapError}
//           >
//             {/* Camera Position */}
//             <Camera
//               ref={cameraRef}
//               zoomLevel={zoomLevel}
//               centerCoordinate={initialCoordinates}
//               animationMode={__DEV__ ? "flyTo" : "moveTo"} // Simpler animation in production
//               animationDuration={CONFIG.MAP_ANIMATION_DURATION}
//               minZoomLevel={4}
//               maxZoomLevel={20}
//             />

//             {/* Add UserLocation component */}
//             <UserLocation
//               visible={true}
//               animated={Platform.OS === "ios"} // Animation can cause issues on some Android devices
//               showsUserHeadingIndicator={true}
//             />

//             {/* Route Line between pickup and delivery - only render if we have valid data */}
//             {routeCoordinates.length > 1 && (
//               <ShapeSource id="routeSource" shape={routeLine}>
//                 <LineLayer
//                   id="routeLine"
//                   style={{
//                     lineColor: "#00CED1",
//                     lineWidth: 3, // Slightly reduced for performance
//                     lineOpacity: 0.8,
//                   }}
//                 />
//               </ShapeSource>
//             )}

//             {/* Only render markers if they've been pre-loaded */}
//             {markersLoaded && (
//               <>
//                 {/* Pickup Marker */}
//                 <ShapeSource id="pickupSource" shape={pickupMarker}>
//                   <SymbolLayer
//                     id="pickupSymbol"
//                     style={{
//                       iconImage: pickupMarkerImage,
//                       iconSize: 0.03,
//                       iconAllowOverlap: true,
//                     }}
//                   />
//                 </ShapeSource>

//                 {/* Delivery Marker */}
//                 <ShapeSource id="deliverySource" shape={deliveryMarker}>
//                   <SymbolLayer
//                     id="deliverySymbol"
//                     style={{
//                       iconImage: deliveryMarkerImage,
//                       iconSize: 0.15,
//                       iconAllowOverlap: true,
//                     }}
//                   />
//                 </ShapeSource>

//                 {/* Agent Marker - only render when data is available and valid */}
//                 {agentLocation &&
//                   Array.isArray(agentLocation) &&
//                   agentLocation.length === 2 &&
//                   !isNaN(agentLocation[0]) &&
//                   !isNaN(agentLocation[1]) &&
//                   agentMarker && (
//                     <ShapeSource id="agentSource" shape={agentMarker}>
//                       <SymbolLayer
//                         id="agentSymbol"
//                         style={{
//                           iconImage: agentMarkerImage,
//                           iconSize: 0.15,
//                           iconAllowOverlap: true,
//                         }}
//                       />
//                     </ShapeSource>
//                   )}
//               </>
//             )}
//           </MapView>
//         ) : (
//           <View style={[styles.map, styles.loadingContainer]}>
//             <ActivityIndicator size="large" color="#00CED1" />
//           </View>
//         )}
//       </View>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: scale(-20),
//   },
//   map: {
//     flex: 1,
//   },
//   loadingContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//   },
// });

// export default Map;
// import {
//   StyleSheet,
//   View,
//   Platform,
//   ActivityIndicator,
//   Image,
//   Text,
// } from "react-native";
// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import MapplsGL from "mappls-map-react-native";
// import {
//   MAPPLS_CLIENT_ID,
//   MAPPLS_CLIENT_SECRET_KEY,
//   MAPPLS_REST_API_KEY,
// } from "@/constants/links";
// import { scale } from "@/utils/styling";
// import ScreenWrapper from "../ScreenWrapper";
// import axios from "axios";
// import { useSocket } from "@/service/socketProvider";
// import { useSafeLocation } from "@/utils/helpers";
// import { colors } from "@/constants/theme";
// import { House } from "phosphor-react-native";

// const {
//   MapView,
//   Camera,
//   UserLocation,
//   ShapeSource,
//   LineLayer,
//   SymbolLayer,
//   Images,
//   CircleLayer,
//   PointAnnotation,
// } = MapplsGL;

// // Configuration based on build type
// const CONFIG = {
//   SOCKET_INTERVAL: __DEV__ ? 60000 : 180000, // 1 min for debug, 3 min for release
//   MAP_ANIMATION_DURATION: __DEV__ ? 1000 : 500, // Shorter animations in production
//   HTTP_TIMEOUT: __DEV__ ? 15000 : 8000, // Shorter timeouts in production
//   CAMERA_PADDING: 100, // Padding for camera bounds
//   MAP_INIT_DELAY: 300, // Delay before initializing map
//   DEFAULT_ZOOM: 12, // Default zoom level
// };

// // Default coordinates for safety
// const DEFAULT_COORDINATES = [77.209, 28.6139]; // Delhi coordinates as fallback

// // Define image assets outside component to prevent recreation
// const MARKER_IMAGES = {
//   pickupMarker: require("@/assets/images/pickup-marker.webp"),
//   deliveryMarker: require("@/assets/images/delivery-marker.webp"),
//   agentMarker: require("@/assets/images/agent-marker.webp"),
// };

// interface MapProps {
//   pickupLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   deliveryLocation: {
//     latitude: number;
//     longitude: number;
//   };
//   orderId: string;
// }

// const Map = ({ pickupLocation, deliveryLocation, orderId }: MapProps) => {
//   const { latitude, longitude } = useSafeLocation();
//   const [mapReady, setMapReady] = useState(false);
//   const [initialCoordinates, setInitialCoordinates] = useState<number[]>([
//     longitude || DEFAULT_COORDINATES[0],
//     latitude || DEFAULT_COORDINATES[1],
//   ]);
//   const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
//   const [zoomLevel, setZoomLevel] = useState(CONFIG.DEFAULT_ZOOM);
//   const [agentLocation, setAgentLocation] = useState<number[] | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [imagesLoaded, setImagesLoaded] = useState(false);

//   const cameraRef = useRef<any>(null);
//   const mapRef = useRef<any>(null);
//   const routeFetchedRef = useRef(false);
//   const socketUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const mountedRef = useRef(true);
//   const markersAddedRef = useRef(false);

//   const socket = useSocket();

//   // Validate location data to prevent crashes
//   const safePickupLocation = useMemo(
//     () => ({
//       latitude: pickupLocation?.latitude || DEFAULT_COORDINATES[1],
//       longitude: pickupLocation?.longitude || DEFAULT_COORDINATES[0],
//     }),
//     [pickupLocation]
//   );

//   const safeDeliveryLocation = useMemo(
//     () => ({
//       latitude: deliveryLocation?.latitude || DEFAULT_COORDINATES[1],
//       longitude: deliveryLocation?.longitude || DEFAULT_COORDINATES[0],
//     }),
//     [deliveryLocation]
//   );

//   // Memoize coordinate transformations to avoid unnecessary recalculations
//   const pickupCoordinates = useMemo(
//     () => [safePickupLocation.longitude, safePickupLocation.latitude],
//     [safePickupLocation.longitude, safePickupLocation.latitude]
//   );

//   const deliveryCoordinates = useMemo(
//     () => [safeDeliveryLocation.longitude, safeDeliveryLocation.latitude],
//     [safeDeliveryLocation.longitude, safeDeliveryLocation.latitude]
//   );

//   // Initialize MapplsGL - only once
//   useEffect(() => {
//     mountedRef.current = true;

//     const initializeMap = async () => {
//       try {
//         await MapplsGL.setMapSDKKey(MAPPLS_REST_API_KEY);
//         await MapplsGL.setRestAPIKey(MAPPLS_REST_API_KEY);
//         await MapplsGL.setAtlasClientId(MAPPLS_CLIENT_ID);
//         await MapplsGL.setAtlasClientSecret(MAPPLS_CLIENT_SECRET_KEY);

//         if (mountedRef.current) {
//           setMapReady(true);
//         }
//       } catch (error) {
//         console.error("Failed to initialize MapplsGL:", error);
//       } finally {
//         if (mountedRef.current) {
//           setIsLoading(false);
//         }
//       }
//     };

//     // Slight delay to ensure native modules are ready
//     const timer = setTimeout(() => {
//       initializeMap();
//     }, CONFIG.MAP_INIT_DELAY);

//     return () => {
//       mountedRef.current = false;
//       clearTimeout(timer);
//     };
//   }, []);

//   // Socket connection management with optimized interval
//   useEffect(() => {
//     if (!socket || !orderId || !mapReady) return;

//     let lastUpdateTime = 0;

//     // Function to emit event with throttling
//     const emitAgentLocationUpdate = () => {
//       const now = Date.now();
//       // Only update if sufficient time has passed
//       if (now - lastUpdateTime > CONFIG.SOCKET_INTERVAL) {
//         if (mountedRef.current) {
//           console.log(
//             "Emitting agentLocationUpdateForUser for order:",
//             orderId
//           );
//           socket.emit("agentLocationUpdateForUser", { orderId });
//           lastUpdateTime = now;
//         }
//       }
//     };

//     // Initial emit
//     emitAgentLocationUpdate();

//     // Set interval with safer approach
//     const interval = setInterval(
//       emitAgentLocationUpdate,
//       CONFIG.SOCKET_INTERVAL
//     );
//     socketUpdateTimerRef.current = interval;

//     // Optimized listener with error handling
//     const handleAgentLocationUpdate = (data: any) => {
//       try {
//         if (
//           data?.agentLocation &&
//           Array.isArray(data.agentLocation) &&
//           data.agentLocation.length === 2 &&
//           !isNaN(data.agentLocation[0]) &&
//           !isNaN(data.agentLocation[1]) &&
//           mountedRef.current
//         ) {
//           setAgentLocation([data.agentLocation[1], data.agentLocation[0]]);
//         }
//       } catch (error) {
//         console.error("Error handling agent location update:", error);
//       }
//     };

//     // Add socket listeners with error handling
//     socket.on("agentCurrentLocation", handleAgentLocationUpdate);
//     socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error);
//     });

//     // Cleanup function
//     return () => {
//       if (socketUpdateTimerRef.current) {
//         clearInterval(socketUpdateTimerRef.current);
//         socketUpdateTimerRef.current = null;
//       }
//       socket.off("agentCurrentLocation", handleAgentLocationUpdate);
//       socket.off("connect_error");
//     };
//   }, [socket, orderId, mapReady]);

//   // Handle image loading once within the MapView
//   const onMapViewLoad = useCallback(() => {
//     if (!markersAddedRef.current) {
//       setImagesLoaded(true);
//       markersAddedRef.current = true;
//     }
//   }, []);

//   // Memoize GeoJSON objects to prevent unnecessary rerenders
//   const pickupMarker = useMemo(
//     () => ({
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           id: "pickup",
//           properties: {
//             id: "pickup",
//             icon: "pickupMarker",
//           },
//           geometry: {
//             type: "Point",
//             coordinates: pickupCoordinates,
//           },
//         },
//       ],
//     }),
//     [pickupCoordinates]
//   );

//   const deliveryMarker = useMemo(
//     () => ({
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           id: "delivery",
//           properties: {
//             id: "delivery",
//             icon: "deliveryMarker",
//           },
//           geometry: {
//             type: "Point",
//             coordinates: deliveryCoordinates,
//           },
//         },
//       ],
//     }),
//     [deliveryCoordinates]
//   );

//   // Only create agent marker when location is valid
//   const agentMarker = useMemo(() => {
//     if (
//       !agentLocation ||
//       !Array.isArray(agentLocation) ||
//       agentLocation.length !== 2
//     ) {
//       return null;
//     }

//     return {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           id: "agent",
//           properties: {
//             id: "agent",
//             icon: "agentMarker",
//           },
//           geometry: {
//             type: "Point",
//             coordinates: agentLocation,
//           },
//         },
//       ],
//     };
//   }, [agentLocation]);

//   const routeLine = useMemo(
//     () => ({
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           properties: {},
//           geometry: {
//             type: "LineString",
//             coordinates: routeCoordinates.length > 1 ? routeCoordinates : [],
//           },
//         },
//       ],
//     }),
//     [routeCoordinates]
//   );

//   // Optimized route fetching with retry and timeout
//   const getRouteCoordinates = useCallback(
//     async (pickup: any, drop: any, retryCount = 0) => {
//       if (routeFetchedRef.current || !mountedRef.current) return; // Prevent duplicate fetches

//       try {
//         setIsLoading(true);
//         const url = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_API_KEY}/route_adv/biking/${pickup.longitude},${pickup.latitude};${drop.longitude},${drop.latitude}?geometries=geojson`;

//         const controller = new AbortController();
//         const timeoutId = setTimeout(
//           () => controller.abort(),
//           CONFIG.HTTP_TIMEOUT
//         );

//         const response = await axios.get(url, {
//           signal: controller.signal,
//           headers: { "Cache-Control": "no-cache" },
//         });

//         clearTimeout(timeoutId);

//         if (
//           response.data?.routes?.[0]?.geometry?.coordinates &&
//           Array.isArray(response.data.routes[0].geometry.coordinates) &&
//           response.data.routes[0].geometry.coordinates.length > 0
//         ) {
//           if (mountedRef.current) {
//             setRouteCoordinates(response.data.routes[0].geometry.coordinates);
//             routeFetchedRef.current = true;
//             setIsLoading(false);
//           }
//         } else {
//           throw new Error("Invalid route data received");
//         }
//       } catch (error) {
//         console.error(
//           `Error fetching route (attempt ${retryCount + 1}):`,
//           error
//         );

//         // Retry logic with exponential backoff (max 2 retries)
//         if (retryCount < 2 && mountedRef.current) {
//           setTimeout(() => {
//             getRouteCoordinates(pickup, drop, retryCount + 1);
//           }, 1000 * Math.pow(2, retryCount)); // 1s, 2s, 4s backoff
//         } else if (mountedRef.current) {
//           setIsLoading(false);
//         }
//       }
//     },
//     []
//   );

//   // Fetch route only when coordinates are available and map is ready
//   useEffect(() => {
//     if (!mapReady || routeFetchedRef.current) return;

//     if (
//       safePickupLocation?.latitude &&
//       safePickupLocation?.longitude &&
//       safeDeliveryLocation?.latitude &&
//       safeDeliveryLocation?.longitude
//     ) {
//       getRouteCoordinates(safePickupLocation, safeDeliveryLocation);
//     }
//   }, [safePickupLocation, safeDeliveryLocation, mapReady, getRouteCoordinates]);

//   // Optimized camera positioning
//   useEffect(() => {
//     if (!mapReady || !cameraRef.current) return;

//     const timer = setTimeout(() => {
//       try {
//         if (!mountedRef.current) return;

//         // Calculate the center point between pickup and delivery
//         const centerLng = (pickupCoordinates[0] + deliveryCoordinates[0]) / 2;
//         const centerLat = (pickupCoordinates[1] + deliveryCoordinates[1]) / 2;

//         // Set initial coordinates to the center
//         setInitialCoordinates([centerLng, centerLat]);

//         // Fit bounds with proper error handling
//         if (
//           cameraRef.current &&
//           !isNaN(pickupCoordinates[0]) &&
//           !isNaN(deliveryCoordinates[0]) &&
//           !isNaN(pickupCoordinates[1]) &&
//           !isNaN(deliveryCoordinates[1])
//         ) {
//           cameraRef.current.fitBounds(
//             [
//               Math.min(pickupCoordinates[0], deliveryCoordinates[0]),
//               Math.min(pickupCoordinates[1], deliveryCoordinates[1]),
//             ],
//             [
//               Math.max(pickupCoordinates[0], deliveryCoordinates[0]),
//               Math.max(pickupCoordinates[1], deliveryCoordinates[1]),
//             ],
//             CONFIG.CAMERA_PADDING,
//             CONFIG.MAP_ANIMATION_DURATION
//           );
//         } else {
//           // Fallback if coordinates are invalid
//           setZoomLevel(CONFIG.DEFAULT_ZOOM);
//         }
//       } catch (error) {
//         console.error("Error positioning camera:", error);
//         // Fallback to center coordinates if bounds calculation fails
//         if (mountedRef.current) {
//           setZoomLevel(CONFIG.DEFAULT_ZOOM);
//         }
//       }
//     }, 1000); // Give more time for map to initialize

//     return () => clearTimeout(timer);
//   }, [pickupCoordinates, deliveryCoordinates, mapReady]);

//   // Error boundary for the map
//   const handleMapError = useCallback((error: any) => {
//     console.error("Map error:", error);
//     // Reset map state on error
//     if (mountedRef.current) {
//       setMapReady(false);
//       setIsLoading(true);

//       // Attempt to re-initialize after a delay
//       setTimeout(() => {
//         if (mountedRef.current) {
//           setMapReady(true);
//           setIsLoading(false);
//         }
//       }, 2000);
//     }
//   }, []);

//   // Cleanup resources on unmount
//   useEffect(() => {
//     return () => {
//       mountedRef.current = false;
//       setRouteCoordinates([]);
//       setAgentLocation(null);
//       routeFetchedRef.current = false;
//       markersAddedRef.current = false;

//       if (socketUpdateTimerRef.current) {
//         clearInterval(socketUpdateTimerRef.current);
//         socketUpdateTimerRef.current = null;
//       }
//     };
//   }, []);

//   // Show loading indicator while map initializes
//   if (isLoading && !mapReady) {
//     return (
//       <ScreenWrapper>
//         <View style={[styles.container, styles.loadingContainer]}>
//           <ActivityIndicator size="large" color="#00CED1" />
//         </View>
//       </ScreenWrapper>
//     );
//   }

//   return (
//     <ScreenWrapper>
//       <View style={styles.container}>
//         {mapReady ? (
//           <MapView
//             ref={mapRef}
//             style={styles.map}
//             zoomEnabled={true}
//             scrollEnabled={true}
//             pitchEnabled={true}
//             rotateEnabled={true}
//             compassEnabled={true}
//             attributionEnabled={true}
//             logoPosition={{ bottom: -150, left: -150 }}
//             onDidFinishLoadingMap={onMapViewLoad}
//             onError={handleMapError}
//           >
//             {/* Pre-load all marker images into MapView's image store using Images component */}
//             <Images
//               images={{
//                 pickupMarker: MARKER_IMAGES.pickupMarker,
//                 deliveryMarker: MARKER_IMAGES.deliveryMarker,
//                 agentMarker: MARKER_IMAGES.agentMarker,
//               }}
//             />

//             {/* Camera Position */}
//             <Camera
//               ref={cameraRef}
//               zoomLevel={zoomLevel}
//               centerCoordinate={initialCoordinates}
//               animationMode="moveTo" // Use simplest animation to reduce jank
//               animationDuration={CONFIG.MAP_ANIMATION_DURATION}
//               minZoomLevel={4}
//               maxZoomLevel={20}
//             />

//             {/* Add UserLocation component */}
//             <UserLocation
//               visible={true}
//               animated={false} // Disable animation for better performance
//               showsUserHeadingIndicator={true}
//             />

//             {/* Route Line between pickup and delivery - only render if we have valid data */}
//             {routeCoordinates.length > 1 && (
//               <ShapeSource id="routeSource" shape={routeLine}>
//                 <LineLayer
//                   id="routeLine"
//                   style={{
//                     lineColor: "#00CED1",
//                     lineWidth: 3,
//                     lineOpacity: 0.8,
//                   }}
//                 />
//               </ShapeSource>
//             )}

//             {/* Only render markers if images are loaded */}
//             {imagesLoaded && (
//               <>
//                 {/* Pickup Marker */}
//                 <PointAnnotation
//                   id="pickupAnnotation"
//                   coordinate={pickupCoordinates}
//                 >
//                   <>
//                     {/* <View
//                       style={{
//                         width: 158,
//                         height: 28,
//                         borderRadius: 14,
//                         backgroundColor: "white",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}
//                     >
//                       <View
//                         style={{
//                           width: 24,
//                           height: 24,
//                           borderRadius: 12,
//                           backgroundColor: colors.PRIMARY,
//                         }}
//                       />
//                     </View>

//                     <View
//                       style={{
//                         position: "absolute",
//                         top: -25, // Adjust positioning
//                         alignSelf: "center",
//                         backgroundColor: "white",
//                         paddingHorizontal: 5,
//                         paddingVertical: 2,
//                         borderRadius: 5,
//                         elevation: 3, // Shadow effect
//                       }}
//                     >
//                       <Text
//                         style={{
//                           fontSize: 12,
//                           fontWeight: "bold",
//                           color: colors.BLACK,
//                         }}
//                       >
//                         Pickup Location
//                       </Text>
//                     </View> */}
//                     <House size={32} />
//                   </>
//                 </PointAnnotation>

//                 {/* Delivery Marker */}
//                 <ShapeSource id="deliverySource" shape={deliveryMarker}>
//                   <SymbolLayer
//                     id="deliverySymbol"
//                     style={{
//                       iconImage: ["get", "icon"],
//                       iconSize: 0.15,
//                       iconAllowOverlap: true,
//                       iconIgnorePlacement: true,
//                     }}
//                   />
//                 </ShapeSource>

//                 {/* Agent Marker - only render when data is available and valid */}
//                 {agentLocation &&
//                   Array.isArray(agentLocation) &&
//                   agentLocation.length === 2 &&
//                   !isNaN(agentLocation[0]) &&
//                   !isNaN(agentLocation[1]) &&
//                   agentMarker && (
//                     <ShapeSource id="agentSource" shape={agentMarker}>
//                       <SymbolLayer
//                         id="agentSymbol"
//                         style={{
//                           iconImage: ["get", "icon"],
//                           iconSize: 0.15,
//                           iconAllowOverlap: true,
//                           iconIgnorePlacement: true,
//                         }}
//                       />
//                     </ShapeSource>
//                   )}
//               </>
//             )}
//           </MapView>
//         ) : (
//           <View style={[styles.map, styles.loadingContainer]}>
//             <ActivityIndicator size="large" color="#00CED1" />
//           </View>
//         )}
//       </View>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: scale(-20),
//   },
//   map: {
//     flex: 1,
//   },
//   loadingContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//   },
// });

// export default Map;
