import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import axios from "axios";

interface Customer {
  customerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

const SkeletonLoader = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f4f4f4",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: 20,
          width: 100,
          backgroundColor: "#e0e0e0",
          borderRadius: 5,
          marginBottom: 8,
        }}
      />
      <View
        style={{
          height: 20,
          width: 150,
          backgroundColor: "#e0e0e0",
          borderRadius: 5,
          marginLeft: 10,
        }}
      />
    </View>
  );
};

const Order = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (reset = false) => {
      if (loading || (!hasMore && !reset)) {
        console.log("Skipping fetch: Already loading or no more data.");
        return;
      }

      if (reset) {
        setPage(1);
        setHasMore(true);
      }

      setLoading(true);
      try {
        console.log(`Fetching page: ${reset ? 1 : page}`);

        const response = await axios.get(
          `https://sound-pleased-mongoose.ngrok-free.app/api/v1/admin/customers/fetch-customer`,
          {
            params: { page: reset ? 1 : page, limit: 20 },
            withCredentials: true,
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTFjZjBmOWVjNjNjN2VmYTUxYTc1ZiIsInJvbGUiOiJBZG1pbiIsIm5hbWUiOiJGYW10byBEaXJlY3RvciIsImlhdCI6MTczODgyOTIzOCwiZXhwIjoxNzM4ODM2NDM4fQ.MYj_BQp1EM6wSOvYX_Wbv5724CH9dDNTqAOBrkhyEgU`,
            },
          }
        );

        console.log("API Response Status:", response.status);
        console.log("Fetched Data Length:", response.data.data.length);

        if (response.data.data.length > 0) {
          setData((prevData) =>
            reset ? response.data.data : [...prevData, ...response.data.data]
          );
          setPage((prevPage) => (reset ? 2 : prevPage + 1));
        } else {
          setHasMore(false);
          console.log("No more data available");
        }
      } catch (err: any) {
        console.error(`Error fetching data: ${err.message}`, err);
      } finally {
        setLoading(false);
        if (reset) setRefreshing(false);
        console.log("Fetch completed, loading set to false.");
      }
    },
    [page, loading, hasMore]
  );

  useEffect(() => {
    console.log("Calling fetchData...");
    fetchData();
  }, []);

  const handleRefresh = () => {
    console.log("Refreshing data...");
    setRefreshing(true);
    fetchData(true);
  };

  const renderItem = ({ item }: { item: Customer }) => {
    return (
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "#f9f9f9",
          borderRadius: 5,
          marginBottom: 5,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.customerId}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.fullName || "N/A"}
        </Text>
        <Text style={{ color: "gray", fontSize: 14 }}>
          {item.email || "No Email"}
        </Text>
        <Text numberOfLines={2} style={{ fontSize: 14, marginTop: 5 }}>
          Phone: {item.phoneNumber || "No Phone"}
        </Text>
      </View>
    );
  };

  // Create a dynamic list of 3 SkeletonLoader items when loading
  const renderFooter = () => {
    if (loading) {
      // Render only 3 skeleton rows
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Orders
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.customerId}-${index}`}
        renderItem={renderItem}
        onEndReached={() => {
          if (!loading && hasMore) {
            fetchData();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={renderFooter} // Use the dynamic footer with 3 skeleton rows
      />
    </View>
  );
};

export default Order;
