import { StyleSheet, View } from "react-native";
import { FC, useEffect, useState } from "react";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "../Typo";
import { colors, radius } from "@/constants/theme";
import { PickAndDropItemProps } from "@/types";

const ItemSpecification: FC<{ items: string }> = ({ items }) => {
  const [data, setData] = useState<PickAndDropItemProps[]>([]);

  useEffect(() => {
    if (typeof items === "string") {
      try {
        const parsedItem = JSON.parse(items);
        if (Array.isArray(parsedItem)) {
          setData(parsedItem);
        } else {
          setData([parsedItem]);
        }
      } catch (error) {
        console.error("Error parsing items:", error);
      }
    }
  }, [items]);

  const RenderItems = ({
    item,
    index,
    isLast,
  }: {
    item: PickAndDropItemProps;
    index: number;
    isLast: boolean;
  }) => {
    return (
      <View
        style={[
          styles.row,
          isLast && styles.lastItem,
          {
            backgroundColor: index % 2 === 0 ? colors.NEUTRAL100 : colors.WHITE,
          },
        ]}
      >
        <Typo
          size={12}
          fontFamily="SemiBold"
          color={colors.NEUTRAL900}
          style={styles.tableHeader}
          textProps={{ numberOfLines: 2 }}
        >
          {item.itemName}
        </Typo>
        <Typo
          size={12}
          fontFamily="SemiBold"
          color={colors.NEUTRAL900}
          style={styles.tableHeader}
        >
          {item.length}*{item.width}*{item.height} cm
        </Typo>
        <Typo
          size={12}
          fontFamily="SemiBold"
          color={colors.NEUTRAL900}
          style={styles.tableHeader}
        >
          {item.weight} kg
        </Typo>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Typo size={14} fontFamily="Medium" color={colors.NEUTRAL900}>
        Item specification
      </Typo>

      <View style={styles.table}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Typo size={12} fontFamily="Medium" style={styles.tableHeader}>
            Item
          </Typo>
          <Typo size={12} fontFamily="Medium" style={styles.tableHeader}>
            Dimension
          </Typo>
          <Typo size={12} fontFamily="Medium" style={styles.tableHeader}>
            Weight
          </Typo>
        </View>

        {data?.length > 0 &&
          data.map((item: PickAndDropItemProps, index: number) => (
            <RenderItems
              key={index}
              item={item}
              index={index}
              isLast={index === data.length - 1}
            />
          ))}
      </View>
    </View>
  );
};

export default ItemSpecification;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginVertical: verticalScale(20),
  },
  table: {
    backgroundColor: colors.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: verticalScale(20),
    borderRadius: radius._10,
  },
  tableHeader: {
    flex: 1,
    textAlign: "center",
    paddingVertical: verticalScale(12),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastItem: {
    borderBottomLeftRadius: radius._10,
    borderBottomRightRadius: radius._10,
  },
});
