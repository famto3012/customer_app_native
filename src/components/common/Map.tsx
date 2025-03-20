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

const { MapView, Camera, UserLocation, ShapeSource, LineLayer, SymbolLayer } =
  MapplsGL;

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
          <ShapeSource id="pickupSource" shape={pickupMarker}>
            <SymbolLayer
              id="pickupSymbol"
              style={{
                iconImage: require("@/assets/images/pickup-marker.webp"),
                iconSize: 0.03,
                iconAllowOverlap: true,
              }}
            />
          </ShapeSource>

          {/* Delivery Marker */}
          <ShapeSource id="deliverySource" shape={deliveryMarker}>
            <SymbolLayer
              id="deliverySymbol"
              style={{
                iconImage: require("@/assets/images/delivery-marker.webp"),
                iconSize: 0.15,
                iconAllowOverlap: true,
              }}
            />
          </ShapeSource>

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
