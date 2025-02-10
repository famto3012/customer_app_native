import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CategoryProps, ProductProps } from "@/types";
import { getAllCategory } from "@/service/universal";

const Wallet = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<{ [key: string]: ProductProps[] }>(
    {}
  );
  const [categoryPage, setCategoryPage] = useState<number>(1);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [hasMoreCategories, setHasMoreCategories] = useState(true);

  const fetchCategories = async () => {
    if (loadingCategories || !hasMoreCategories) return;

    setLoadingCategories(true);
    try {
      const merchantId = "M25021";
      const businessCategoryId = "679b10ad9c7961005b6168a2";
      const res = await getAllCategory(
        merchantId,
        businessCategoryId,
        categoryPage,
        3
      );

      if (res.category.length) {
        setCategories((prev) => [...prev, ...res.category]);
        setCategoryPage((prevPage) => prevPage + 1);
      } else {
        setHasMoreCategories(false);
      }
    } catch (err) {
      console.log(`Error in fetching categories: ${err}`);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async (categoryId: string) => {
    if (loadingProducts[categoryId]) return;

    setLoadingProducts((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const customerId = "";
      const res = await getAllCategory(categoryId, customerId, 1, 10);
      if (res.product) {
        setProducts((prev) => ({ ...prev, [categoryId]: res.product }));
      }
    } catch (err) {
      console.log(
        `Error in fetching products for category ${categoryId}: ${err}`
      );
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newState = { ...prev, [categoryId]: !prev[categoryId] };
      if (!products[categoryId] && !prev[categoryId]) {
        fetchProducts(categoryId);
      }
      return newState;
    });
  };

  const renderProduct = ({ item }: { item: ProductProps }) => (
    <View style={styles.productItem}>
      <Text style={styles.productTitle}>{item.productName}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  const renderCategory = ({ item }: { item: CategoryProps }) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity onPress={() => toggleCategory(item.categoryId)}>
        <Text style={styles.categoryTitle}>{item.categoryName}</Text>
        <Text style={styles.categoryStatus}>
          {item.status ? "Active" : "Inactive"}
        </Text>
      </TouchableOpacity>

      {expandedCategories[item.categoryId] && (
        <FlatList
          data={products[item.categoryId] || []}
          keyExtractor={(product) => product.productId.toString()}
          renderItem={renderProduct}
          nestedScrollEnabled
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.categoryId.toString()}
        renderItem={renderCategory}
        onEndReached={fetchCategories}
        onEndReachedThreshold={0.5}
        nestedScrollEnabled
      />
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  categoryContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 5,
  },
  categoryTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  categoryStatus: {
    color: "gray",
    fontSize: 14,
  },
  productItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  productTitle: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 12,
    color: "green",
  },
});
