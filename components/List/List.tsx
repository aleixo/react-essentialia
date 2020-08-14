import React from 'react';
import { FlatList, Text } from 'react-native';

const List = ({
  title,
  datasource,
  titleStyle,
  item,
  listStyle,
  horizontal,
}) => {
  return (
    <>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
          ...titleStyle,
        }}>
        {title}
      </Text>
      <FlatList
        keyExtractor={(item, index) => 'key' + index}
        style={{ marginBottom: 30, ...listStyle }}
        data={datasource}
        horizontal={horizontal}
        renderItem={item}
      />
    </>
  );
};

export default List;
