import React, { useState, useEffect } from "react";
import { View, Dimensions, Animated } from "react-native";

import Overlay from "../Overlay";

interface Props {
  onOverlayPress: Function;
  header: any;
  children: any;
}

const Popup = ({ children, onOverlayPress, header }: Props) => {
  const [state] = useState({
    heighAnimatedValue: new Animated.Value(0),
  });

  useEffect(() => {
    Animated.timing(state.heighAnimatedValue, {
      toValue: Dimensions.get("screen").height - 250,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <React.Fragment>
      <Overlay onPress={onOverlayPress} />
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 2222,
          width: "100%",
          height: Dimensions.get("screen").height - 250,
          backgroundColor: "white",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
          }}
        >
          <View
            style={{
              height: 60,
              backgroundColor: "transparent",
            }}
          >
            {header}
          </View>
          <View
            style={{
              height: 400,
              width: "100%",
            }}
          >
            {children}
          </View>
        </View>
      </Animated.View>
    </React.Fragment>
  );
};

export default Popup;
