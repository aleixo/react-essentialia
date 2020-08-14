import React from "react";
import { View, TouchableHighlight } from "react-native";

interface Props {
  onPress: Function;
  overlayColor?: String | "black";
  underlayColor?: String | "black";
}

const Overlay = ({ overlayColor, underlayColor, onPress }: Props) => (
  <TouchableHighlight
    style={{
      flex: 1,
      zIndex: 2222,
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: overlayColor || "black",
      opacity: 0.1,
    }}
    underlayColor={underlayColor}
    onPress={onPress}
  >
    <View />
  </TouchableHighlight>
);

export default Overlay;
