import React from 'react';

import { Button, View } from 'libs/ui';
import { Text } from 'react-native';

interface Props {}

const NavigatorCell = ({ title, rightContent, onPress }) => (
  <View>
    <Text>{title}</Text>
    <Button onPress={onPress}>{rightContent}</Button>
  </View>
);

const BuildCell = ({ title, rightContent, onPress }) => {
  return (
    <NavigatorCell
      title={title}
      rightContent={rightContent}
      onPress={onPress}
    />
  );
};

const Cell = ({ ...props }: Props) => {
  const CellWrapper = ({ children, onPress }) => {
    return props.onCellPress ? (
      <Button onPress={{ onPress }}>{children}</Button>
    ) : (
      <View>{children}</View>
    );
  };
  return (
    <CellWrapper>
      <BuildCell {...props} />
    </CellWrapper>
  );
};

export default Cell;
