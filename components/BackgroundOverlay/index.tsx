import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { useTheme } from "../../useTheme";

interface Props {
  image?: string | { uri: string };
  backgroundColor?: string;
  style?: object;
  children: any;
}

export default ({ children, image, backgroundColor, style }: Props) => {
  const [themeState] = useTheme();
  return (
    <ImageBackground source={image} style={styles.photo}>
      <View
        style={{
          ...(style || styles.container),
          backgroundColor: themeState.color[backgroundColor] || backgroundColor,
        }}
      >
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
});
