import React, { memo } from "react";
import ProductItem from "./ProductItem";
import { ProductProps } from "@/types";

const ProductsList = memo(
  ({
    products,
    openVariant,
    openDetail,
  }: {
    products: ProductProps[];
    openVariant: (count?: number) => void;
    openDetail: () => void;
  }) => {
    return (
      <>
        {products.map((product) => (
          <ProductItem
            key={product.productId.toString()}
            product={product}
            showAddCart
            openVariant={openVariant}
            openDetail={openDetail}
          />
        ))}
      </>
    );
  }
);

export default ProductsList;
