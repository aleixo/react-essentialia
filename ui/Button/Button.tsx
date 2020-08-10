import React, { useContext } from "react";

import {
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import context from "../context";

const computedStyle = (strech, size, round) => {
  let computedStyle = { view: {}, touchable: {} };
  if (round) {
    computedStyle = {
      ...computedStyle,
      touchable: {
        ...computedStyle.touchable,
        borderRadius: round ? size / 2 : 0,
      },
    };
  }
  if (size) {
    computedStyle = {
      ...computedStyle,
      touchable: {
        ...computedStyle.touchable,
        width: size,
        height: size,
      },
    };
  }
  if (strech) {
    computedStyle = {
      ...computedStyle,
      view: {
        ...computedStyle.view,
        flex: 1,
        flexDirection: "column",
      },
      touchable: {
        ...computedStyle.touchable,
        width: "100%",
        height: "100%",
      },
    };
  }
  return computedStyle;
};

interface Props {
  title?: string;
  textColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  size?: number;
  width?: number;
  height?: number;
  onPress?: Function;
  textSize?: number;
  textWeight?: string;
  round?: boolean;
  borderColor?: string;
  children?: any;
  marginHorizontal?: number;
  strech?: boolean;
  borderRadius?: number;
  align?: string;
  padding?: number;
}

const Button = ({
  title,
  textColor,
  backgroundColor,
  borderWidth,
  size,
  width,
  height,
  onPress,
  textSize,
  textWeight,
  round,
  borderColor,
  children,
  marginHorizontal,
  strech,
  borderRadius,
  align,
  padding,
}: Props) => {
  const contextObj = useContext(context);
  const extraStyle = computedStyle(strech, size, round);
  return (
    <View
      style={{
        ...extraStyle.view,
      }}
    >
      <TouchableOpacity
        style={{
          alignItems: align ? align : "center",
          justifyContent: "center",
          borderWidth,
          borderColor,
          backgroundColor,
          marginHorizontal,
          borderRadius: borderRadius ? borderRadius : round ? size / 2 : 0,
          width: width,
          height: height,
          padding,
          ...extraStyle.touchable,
        }}
        onPress={onPress}
      >
        {children ? (
          title ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {children}
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: textSize,
                  fontWeight: textWeight,
                  color: textColor,
                }}
              >
                {title}
              </Text>
            </View>
          ) : (
            children
          )
        ) : (
          <Text
            style={{
              fontSize: textSize,
              fontWeight: textWeight,
              color: textColor,
              textAlign: round && "center",
            }}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;
