import * as React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import Button from '../Button';

interface LocalizedPropsProps {
  top: number;
  left: number;
  reverse?: boolean;
  onListItemPress?: Function;
}

const LocalizedProps: React.SFC<LocalizedPropsProps> = ({
  top,
  left,
  reverse,
  onListItemPress,
  listCell,
}) => {
  const ListItemWrapper = ({ children, onPress }) => {
    return onListItemPress ? (
      <Button onPress={{ onPress }}>{children}</Button>
    ) : (
      <View>{children}</View>
    );
  };
  return (
    <View
      style={{
        position: 'absolute',
        top,
        left,
        backgroundColor: 'blue',
        borderRadius: 5,
      }}>
      <View style={styles.triangle} />
      <FlatList
        data={[{ id: 'a', title: 'My title' }]}
        renderItem={({ item }) => {
          return (
            <ListItemWrapper
              onPress={() => onListItemPress && onListItemPress(item)}>
              <Text>{item.title}</Text>
            </ListItemWrapper>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  triangle: {
    width: 5,
    height: 5,
    position: 'absolute',
    top: -10,
    left: 20,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'red',
  },
});

export default LocalizedProps;
