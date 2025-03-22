import React, { FC, memo } from "react";
import ProductItem from "./ProductItem";
import { ProductProps } from "@/types";
import { FlatList } from "react-native";

interface ProductsListProps {
  products: ProductProps[];
  openVariant: (count?: number) => void;
  openDetail: () => void;
}

const ProductsList: FC<ProductsListProps> = memo(
  ({ products, openVariant, openDetail }) => {
    return (
      <>
        {products.map((product) => (
          <ProductItem
            key={product.productId}
            product={product}
            showAddCart
            openVariant={openVariant}
            openDetail={openDetail}
          />
        ))}
      </>
    );
  },
  (prevProps, nextProps) => {
    // Optimization: Compare length first, then IDs to avoid deep comparison
    if (prevProps.products.length !== nextProps.products.length) return false;
    return prevProps.products.every(
      (product, index) =>
        product.productId === nextProps.products[index].productId
    );
  }
);

export default ProductsList;
