import React, { useContext } from "react";

import { View, TouchableOpacity, ButtonProps } from "react-native";

import { UI } from "..";
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

interface Props extends ButtonProps {
  textColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  size?: number;
  width?: number;
  height?: number;
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
  ...props
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
        {...props}
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
          ...props.style,
        }}
        onPress={onPress}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal:
              contextObj.styleExtensions?.button.paddingHorizontal,
          }}
        >
          {children}
          <UI.Text
            style={{
              fontSize: textSize,
              fontWeight: textWeight,
              textAlign: round && "center",
              color: textColor
                ? textColor
                : contextObj.styleExtensions?.button?.color,
            }}
          >
            {title}
          </UI.Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
