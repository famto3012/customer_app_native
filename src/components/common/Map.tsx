// import { StyleSheet, View, ActivityIndicator } from "react-native";
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
// import { House, Storefront } from "phosphor-react-native";
// import MapLoader from "../Loader/MapLoader";

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
// const DEFAULT_COORDINATES = [76.936967, 8.529635]; // Delhi coordinates as fallback

// // Define image assets outside component to prevent recreation
// const MARKER_IMAGES = {
//   agentMarker: require("@/assets/images/agent-marker.webp"),
//   pickupMarker: require("@/assets/images/pickup-marker.webp"),
//   deliveryMarker: require("@/assets/images/delivery-marker.webp"),
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

//   const pickupMarker = useMemo(() => {
//     if (
//       !pickupCoordinates ||
//       !Array.isArray(pickupCoordinates) ||
//       pickupCoordinates.length !== 2
//     ) {
//       return null;
//     }

//     return {
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
//     };
//   }, [pickupCoordinates]);

//   const deliveryMarker = useMemo(() => {
//     if (
//       !deliveryCoordinates ||
//       !Array.isArray(deliveryCoordinates) ||
//       deliveryCoordinates.length !== 2
//     ) {
//       return null;
//     }

//     return {
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
//     };
//   }, [deliveryCoordinates]);

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
//           <MapLoader />
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
//                 agentMarker: MARKER_IMAGES.agentMarker,
//                 pickupMarker: MARKER_IMAGES.pickupMarker,
//                 deliveryMarker: MARKER_IMAGES.deliveryMarker,
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
//                     lineColor: colors.PRIMARY,
//                     lineWidth: 4,
//                     lineOpacity: 0.8,
//                   }}
//                 />
//               </ShapeSource>
//             )}

//             {/* Only render markers if images are loaded */}
//             {imagesLoaded && (
//               <>
//                 {/* Pickup Marker */}
//                 {/* <PointAnnotation
//                   id="pickupAnnotation"
//                   title="pickup"
//                   coordinate={pickupCoordinates}
//                   selected={true}
//                 >
//                   <View
//                     style={{
//                       alignItems: "center",
//                       justifyContent: "center",
//                       width: scale(40),
//                       height: scale(40),
//                       borderRadius: scale(30),
//                       backgroundColor: colors.PRIMARY,
//                       borderWidth: 2,
//                       borderColor: colors.WHITE,
//                       // padding: 1,
//                     }}
//                   >
//                     <Storefront
//                       color={colors.WHITE}
//                       size={28}
//                       weight="duotone"
//                     />
//                   </View>
//                 </PointAnnotation>

//                 <PointAnnotation
//                   id="deliveryAnnotation"
//                   title="delivery"
//                   coordinate={deliveryCoordinates}
//                   selected={true}
//                 >
//                   <View
//                     style={{
//                       alignItems: "center",
//                       justifyContent: "center",
//                       width: scale(40),
//                       height: scale(40),
//                       borderRadius: scale(30),
//                       backgroundColor: colors.PRIMARY,
//                       borderWidth: 2,
//                       borderColor: colors.WHITE,
//                       zIndex: 1,
//                       // padding: 1,
//                     }}
//                   >
//                     <House color={colors.WHITE} size={28} weight="duotone" />
//                   </View>
//                 </PointAnnotation> */}

//                 <ShapeSource id="pickupSource" shape={pickupMarker}>
//                   <SymbolLayer
//                     id="pickupSymbol"
//                     style={{
//                       iconImage: ["get", "icon"],
//                       iconSize: 0.15,
//                       iconAllowOverlap: true,
//                       iconIgnorePlacement: false,
//                     }}
//                   />
//                 </ShapeSource>

//                 <ShapeSource id="deliverySource" shape={deliveryMarker}>
//                   <SymbolLayer
//                     id="deliverySymbol"
//                     style={{
//                       iconImage: ["get", "icon"],
//                       iconSize: 0.15,
//                       iconAllowOverlap: true,
//                       iconIgnorePlacement: false,
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
//                           iconAllowOverlap: false,
//                           iconIgnorePlacement: false,
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
import {
  MAPPLS_CLIENT_ID,
  MAPPLS_CLIENT_SECRET_KEY,
  MAPPLS_REST_API_KEY,
} from "@/constants/links";
import { colors } from "@/constants/theme";
import { useSocket } from "@/service/socketProvider";
import { useSafeLocation } from "@/utils/helpers";
import { scale } from "@/utils/styling";
import axios from "axios";
import MapplsGL from "mappls-map-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapLoader from "../Loader/MapLoader";
import ScreenWrapper from "../ScreenWrapper";

const {
  MapView,
  Camera,
  UserLocation,
  ShapeSource,
  LineLayer,
  SymbolLayer,
  Images,
  CircleLayer,
  PointAnnotation,
} = MapplsGL;

// Configuration based on build type
const CONFIG = {
  SOCKET_INTERVAL: __DEV__ ? 60000 : 180000, // 1 min for debug, 3 min for release
  MAP_ANIMATION_DURATION: __DEV__ ? 1000 : 500, // Shorter animations in production
  HTTP_TIMEOUT: __DEV__ ? 15000 : 8000, // Shorter timeouts in production
  CAMERA_PADDING: 100, // Padding for camera bounds
  MAP_INIT_DELAY: 300, // Delay before initializing map
  DEFAULT_ZOOM: 12, // Default zoom level
};

// Default coordinates for safety
const DEFAULT_COORDINATES = [76.936967, 8.529635]; // Delhi coordinates as fallback

// Define image assets outside component to prevent recreation
const MARKER_IMAGES = {
  agentMarker: require("@/assets/images/agent-marker.webp"),
  pickupMarker: require("@/assets/images/pickup-marker.webp"),
  deliveryMarker: require("@/assets/images/delivery-marker.webp"),
};

interface MapProps {
  pickupLocation?: {
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
  const [mapReady, setMapReady] = useState(false);
  const [initialCoordinates, setInitialCoordinates] = useState<number[]>([
    longitude || DEFAULT_COORDINATES[0],
    latitude || DEFAULT_COORDINATES[1],
  ]);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [zoomLevel, setZoomLevel] = useState(CONFIG.DEFAULT_ZOOM);
  const [agentLocation, setAgentLocation] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const routeFetchedRef = useRef(false);
  const socketUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const markersAddedRef = useRef(false);

  const socket = useSocket();

  // Check if pickup location is provided
  const hasPickupLocation = useMemo(
    () => !!pickupLocation?.latitude && !!pickupLocation?.longitude,
    [pickupLocation]
  );

  // Validate location data to prevent crashes
  const safePickupLocation = useMemo(
    () =>
      hasPickupLocation
        ? {
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude,
          }
        : null,
    [pickupLocation, hasPickupLocation]
  );

  const safeDeliveryLocation = useMemo(
    () => ({
      latitude: deliveryLocation?.latitude || DEFAULT_COORDINATES[1],
      longitude: deliveryLocation?.longitude || DEFAULT_COORDINATES[0],
    }),
    [deliveryLocation]
  );

  // Memoize coordinate transformations to avoid unnecessary recalculations
  const pickupCoordinates = useMemo(
    () =>
      safePickupLocation
        ? [safePickupLocation.longitude, safePickupLocation.latitude]
        : null,
    [safePickupLocation]
  );

  const deliveryCoordinates = useMemo(
    () => [safeDeliveryLocation.longitude, safeDeliveryLocation.latitude],
    [safeDeliveryLocation.longitude, safeDeliveryLocation.latitude]
  );

  // Initialize MapplsGL - only once
  useEffect(() => {
    mountedRef.current = true;

    const initializeMap = async () => {
      try {
        await MapplsGL.setMapSDKKey(MAPPLS_REST_API_KEY);
        await MapplsGL.setRestAPIKey(MAPPLS_REST_API_KEY);
        await MapplsGL.setAtlasClientId(MAPPLS_CLIENT_ID);
        await MapplsGL.setAtlasClientSecret(MAPPLS_CLIENT_SECRET_KEY);

        if (mountedRef.current) {
          setMapReady(true);
        }
      } catch (error) {
        console.error("Failed to initialize MapplsGL:", error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Slight delay to ensure native modules are ready
    const timer = setTimeout(() => {
      initializeMap();
    }, CONFIG.MAP_INIT_DELAY);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, []);

  // Socket connection management with optimized interval
  useEffect(() => {
    if (!socket || !orderId || !mapReady) return;

    let lastUpdateTime = 0;

    // Function to emit event with throttling
    const emitAgentLocationUpdate = () => {
      const now = Date.now();
      // Only update if sufficient time has passed
      if (now - lastUpdateTime > CONFIG.SOCKET_INTERVAL) {
        if (mountedRef.current) {
          console.log(
            "Emitting agentLocationUpdateForUser for order:",
            orderId
          );
          socket.emit("agentLocationUpdateForUser", { orderId });
          lastUpdateTime = now;
        }
      }
    };

    // Initial emit
    emitAgentLocationUpdate();

    // Set interval with safer approach
    const interval = setInterval(
      emitAgentLocationUpdate,
      CONFIG.SOCKET_INTERVAL
    );
    socketUpdateTimerRef.current = interval;

    // Optimized listener with error handling
    const handleAgentLocationUpdate = (data: any) => {
      try {
        if (
          data?.agentLocation &&
          Array.isArray(data.agentLocation) &&
          data.agentLocation.length === 2 &&
          !isNaN(data.agentLocation[0]) &&
          !isNaN(data.agentLocation[1]) &&
          mountedRef.current
        ) {
          setAgentLocation([data.agentLocation[1], data.agentLocation[0]]);
        }
      } catch (error) {
        console.error("Error handling agent location update:", error);
      }
    };

    // Add socket listeners with error handling
    socket.on("agentCurrentLocation", handleAgentLocationUpdate);
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup function
    return () => {
      if (socketUpdateTimerRef.current) {
        clearInterval(socketUpdateTimerRef.current);
        socketUpdateTimerRef.current = null;
      }
      socket.off("agentCurrentLocation", handleAgentLocationUpdate);
      socket.off("connect_error");
    };
  }, [socket, orderId, mapReady]);

  // Handle image loading once within the MapView
  const onMapViewLoad = useCallback(() => {
    if (!markersAddedRef.current) {
      setImagesLoaded(true);
      markersAddedRef.current = true;
    }
  }, []);

  // Only create agent marker when location is valid
  const agentMarker = useMemo(() => {
    if (
      !agentLocation ||
      !Array.isArray(agentLocation) ||
      agentLocation.length !== 2
    ) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "agent",
          properties: {
            id: "agent",
            icon: "agentMarker",
          },
          geometry: {
            type: "Point",
            coordinates: agentLocation,
          },
        },
      ],
    };
  }, [agentLocation]);

  const pickupMarker = useMemo(() => {
    if (
      !pickupCoordinates ||
      !Array.isArray(pickupCoordinates) ||
      pickupCoordinates.length !== 2
    ) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "pickup",
          properties: {
            id: "pickup",
            icon: "pickupMarker",
          },
          geometry: {
            type: "Point",
            coordinates: pickupCoordinates,
          },
        },
      ],
    };
  }, [pickupCoordinates]);

  const deliveryMarker = useMemo(() => {
    if (
      !deliveryCoordinates ||
      !Array.isArray(deliveryCoordinates) ||
      deliveryCoordinates.length !== 2
    ) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "delivery",
          properties: {
            id: "delivery",
            icon: "deliveryMarker",
          },
          geometry: {
            type: "Point",
            coordinates: deliveryCoordinates,
          },
        },
      ],
    };
  }, [deliveryCoordinates]);

  const routeLine = useMemo(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: routeCoordinates.length > 1 ? routeCoordinates : [],
          },
        },
      ],
    }),
    [routeCoordinates]
  );

  // Optimized route fetching with retry and timeout - skip if no pickup location
  const getRouteCoordinates = useCallback(
    async (pickup: any, drop: any, retryCount = 0) => {
      if (routeFetchedRef.current || !mountedRef.current) return;

      try {
        setIsLoading(true);
        const url = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_REST_API_KEY}/route_adv/biking/${pickup.longitude},${pickup.latitude};${drop.longitude},${drop.latitude}?geometries=geojson`;

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          CONFIG.HTTP_TIMEOUT
        );

        const response = await axios.get(url, {
          signal: controller.signal,
          headers: { "Cache-Control": "no-cache" },
        });

        clearTimeout(timeoutId);

        if (
          response.data?.routes?.[0]?.geometry?.coordinates &&
          Array.isArray(response.data.routes[0].geometry.coordinates) &&
          response.data.routes[0].geometry.coordinates.length > 0
        ) {
          if (mountedRef.current) {
            setRouteCoordinates(response.data.routes[0].geometry.coordinates);
            routeFetchedRef.current = true;
            setIsLoading(false);
          }
        } else {
          throw new Error("Invalid route data received");
        }
      } catch (error) {
        console.error(
          `Error fetching route (attempt ${retryCount + 1}):`,
          error
        );

        // Retry logic with exponential backoff (max 2 retries)
        if (retryCount < 2 && mountedRef.current) {
          setTimeout(() => {
            getRouteCoordinates(pickup, drop, retryCount + 1);
          }, 1000 * Math.pow(2, retryCount)); // 1s, 2s, 4s backoff
        } else if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  // Fetch route only when coordinates are available, map is ready, and pickup exists
  useEffect(() => {
    if (!mapReady || routeFetchedRef.current) return;

    // Only fetch route if pickup location exists
    if (
      hasPickupLocation &&
      safePickupLocation?.latitude &&
      safePickupLocation?.longitude &&
      safeDeliveryLocation?.latitude &&
      safeDeliveryLocation?.longitude
    ) {
      getRouteCoordinates(safePickupLocation, safeDeliveryLocation);
    } else {
      // If no pickup location, mark route as fetched to avoid attempts
      routeFetchedRef.current = true;
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [
    safePickupLocation,
    safeDeliveryLocation,
    mapReady,
    getRouteCoordinates,
    hasPickupLocation,
  ]);

  // Optimized camera positioning - adjust based on available points
  useEffect(() => {
    if (!mapReady || !cameraRef.current) return;

    const timer = setTimeout(() => {
      try {
        if (!mountedRef.current) return;

        // If we have both pickup and delivery
        if (hasPickupLocation && pickupCoordinates && deliveryCoordinates) {
          // Calculate the center point between pickup and delivery
          const centerLng = (pickupCoordinates[0] + deliveryCoordinates[0]) / 2;
          const centerLat = (pickupCoordinates[1] + deliveryCoordinates[1]) / 2;

          // Set initial coordinates to the center
          setInitialCoordinates([centerLng, centerLat]);

          // Fit bounds with proper error handling
          if (
            cameraRef.current &&
            !isNaN(pickupCoordinates[0]) &&
            !isNaN(deliveryCoordinates[0]) &&
            !isNaN(pickupCoordinates[1]) &&
            !isNaN(deliveryCoordinates[1])
          ) {
            cameraRef.current.fitBounds(
              [
                Math.min(pickupCoordinates[0], deliveryCoordinates[0]),
                Math.min(pickupCoordinates[1], deliveryCoordinates[1]),
              ],
              [
                Math.max(pickupCoordinates[0], deliveryCoordinates[0]),
                Math.max(pickupCoordinates[1], deliveryCoordinates[1]),
              ],
              CONFIG.CAMERA_PADDING,
              CONFIG.MAP_ANIMATION_DURATION
            );
          }
        }
        // If we only have delivery location
        else if (deliveryCoordinates) {
          // Just focus on delivery location
          setInitialCoordinates(deliveryCoordinates);
          setZoomLevel(CONFIG.DEFAULT_ZOOM);
        }
        // Fallback to default
        else {
          setZoomLevel(CONFIG.DEFAULT_ZOOM);
        }
      } catch (error) {
        console.error("Error positioning camera:", error);
        // Fallback to center coordinates if bounds calculation fails
        if (mountedRef.current) {
          setZoomLevel(CONFIG.DEFAULT_ZOOM);
        }
      }
    }, 1000); // Give more time for map to initialize

    return () => clearTimeout(timer);
  }, [pickupCoordinates, deliveryCoordinates, mapReady, hasPickupLocation]);

  // Error boundary for the map
  const handleMapError = useCallback((error: any) => {
    console.error("Map error:", error);
    // Reset map state on error
    if (mountedRef.current) {
      setMapReady(false);
      setIsLoading(true);

      // Attempt to re-initialize after a delay
      setTimeout(() => {
        if (mountedRef.current) {
          setMapReady(true);
          setIsLoading(false);
        }
      }, 2000);
    }
  }, []);

  // Cleanup resources on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      setRouteCoordinates([]);
      setAgentLocation(null);
      routeFetchedRef.current = false;
      markersAddedRef.current = false;

      if (socketUpdateTimerRef.current) {
        clearInterval(socketUpdateTimerRef.current);
        socketUpdateTimerRef.current = null;
      }
    };
  }, []);

  // Show loading indicator while map initializes
  if (isLoading && !mapReady) {
    return (
      <ScreenWrapper>
        <View style={[styles.container, styles.loadingContainer]}>
          <MapLoader />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {mapReady ? (
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
            onDidFinishLoadingMap={onMapViewLoad}
            onError={handleMapError}
          >
            {/* Pre-load all marker images into MapView's image store using Images component */}
            <Images
              images={{
                agentMarker: MARKER_IMAGES.agentMarker,
                pickupMarker: MARKER_IMAGES.pickupMarker,
                deliveryMarker: MARKER_IMAGES.deliveryMarker,
              }}
            />

            {/* Camera Position */}
            <Camera
              ref={cameraRef}
              zoomLevel={zoomLevel}
              centerCoordinate={initialCoordinates}
              animationMode="moveTo" // Use simplest animation to reduce jank
              animationDuration={CONFIG.MAP_ANIMATION_DURATION}
              minZoomLevel={4}
              maxZoomLevel={20}
            />

            {/* Add UserLocation component */}
            <UserLocation
              visible={true}
              animated={false} // Disable animation for better performance
              showsUserHeadingIndicator={true}
            />

            {/* Route Line between pickup and delivery - only render if we have valid data AND pickup location */}
            {hasPickupLocation && routeCoordinates.length > 1 && (
              <ShapeSource id="routeSource" shape={routeLine}>
                <LineLayer
                  id="routeLine"
                  style={{
                    lineColor: colors.PRIMARY,
                    lineWidth: 4,
                    lineOpacity: 0.8,
                  }}
                />
              </ShapeSource>
            )}

            {/* Only render markers if images are loaded */}
            {imagesLoaded && (
              <>
                {/* Pickup Marker - only if pickup location exists */}
                {hasPickupLocation && pickupMarker && (
                  <ShapeSource id="pickupSource" shape={pickupMarker}>
                    <SymbolLayer
                      id="pickupSymbol"
                      style={{
                        iconImage: ["get", "icon"],
                        iconSize: 0.15,
                        iconAllowOverlap: true,
                        iconIgnorePlacement: false,
                      }}
                    />
                  </ShapeSource>
                )}

                {/* Delivery Marker - always show */}
                <ShapeSource id="deliverySource" shape={deliveryMarker}>
                  <SymbolLayer
                    id="deliverySymbol"
                    style={{
                      iconImage: ["get", "icon"],
                      iconSize: 0.15,
                      iconAllowOverlap: true,
                      iconIgnorePlacement: false,
                    }}
                  />
                </ShapeSource>

                {/* Agent Marker - only render when data is available and valid */}
                {agentLocation &&
                  Array.isArray(agentLocation) &&
                  agentLocation.length === 2 &&
                  !isNaN(agentLocation[0]) &&
                  !isNaN(agentLocation[1]) &&
                  agentMarker && (
                    <ShapeSource id="agentSource" shape={agentMarker}>
                      <SymbolLayer
                        id="agentSymbol"
                        style={{
                          iconImage: ["get", "icon"],
                          iconSize: 0.15,
                          iconAllowOverlap: false,
                          iconIgnorePlacement: false,
                        }}
                      />
                    </ShapeSource>
                  )}
              </>
            )}
          </MapView>
        ) : (
          <View style={[styles.map, styles.loadingContainer]}>
            <ActivityIndicator size="large" color="#00CED1" />
          </View>
        )}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});

export default Map;
