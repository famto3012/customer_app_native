import { ProductProps, SelectedAddress } from "@/types";
import { createContext, FC, ReactNode, useContext, useState } from "react";

// Define the type for product counts with optional variantTypeId
type ProductCountType = {
  count: number;
  variantTypeId?: string; // ✅ Make variantTypeId optional
};

type AlertDataType = {
  title?: string;
  body: string;
  cancelText: string;
  confirmText: string;
};

// Define the type for the context value
interface DataContextType {
  product: ProductProps | null;
  setProduct: React.Dispatch<React.SetStateAction<ProductProps | null>>;
  productCounts: { [productId: string]: ProductCountType };
  setProductCounts: React.Dispatch<
    React.SetStateAction<{ [productId: string]: ProductCountType }>
  >;
  openDuplicate: boolean;
  setOpenDuplicate: React.Dispatch<React.SetStateAction<boolean>>;
  productFilter: string;
  setProductFilter: React.Dispatch<React.SetStateAction<string>>;
  pickAddress: SelectedAddress;
  setPickAddress: React.Dispatch<React.SetStateAction<SelectedAddress>>;
  dropAddress: SelectedAddress;
  setDropAddress: React.Dispatch<React.SetStateAction<SelectedAddress>>;
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  alertData: AlertDataType;
  setAlertData: React.Dispatch<React.SetStateAction<AlertDataType>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [productCounts, setProductCounts] = useState<{
    [productId: string]: ProductCountType;
  }>({});
  const [openDuplicate, setOpenDuplicate] = useState<boolean>(false);
  const [productFilter, setProductFilter] = useState<string>("");
  const [pickAddress, setPickAddress] = useState<SelectedAddress>({
    type: "",
    otherId: "",
    address: "",
  });
  const [dropAddress, setDropAddress] = useState<SelectedAddress>({
    type: "",
    otherId: "",
    address: "",
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<AlertDataType>({
    title: undefined,
    body: "",
    cancelText: "Cancel",
    confirmText: "Confirm",
  });

  return (
    <DataContext.Provider
      value={{
        product,
        setProduct,
        productCounts,
        setProductCounts,
        openDuplicate,
        setOpenDuplicate,
        productFilter,
        setProductFilter,
        pickAddress,
        setPickAddress,
        dropAddress,
        setDropAddress,
        showAlert,
        setShowAlert,
        alertData,
        setAlertData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
