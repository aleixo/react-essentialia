import React from "react";
import { FlatList } from "react-native";

const List = ({ data, item, horizontal, draggable }) => {
  return (
    <FlatList
      keyExtractor={(item, index) => "key_" + index}
      data={data}
      horizontal={horizontal}
      renderItem={item}
    />
  );
};

export default List;
