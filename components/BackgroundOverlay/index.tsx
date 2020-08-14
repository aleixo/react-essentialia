import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});

interface Props {
  image?: string | { uri: string };
  backgroundColor?: string;
  style?: object;
  children: any;
}

export default ({ children, image, backgroundColor, style }: Props) => (
  <ImageBackground source={image} style={styles.photo}>
    <View
      style={{
        ...(style || styles.container),
        backgroundColor,
      }}>
      {children}
    </View>
  </ImageBackground>
);
