import React, { useContext, useState } from "react";
import { View as RNView, StyleSheet, ViewProps, ViewStyle } from "react-native";

import context from "../context";
import { Uuid } from "../helpers";
import { useTheme } from "../..";

interface Props extends ViewProps {
  shadow?: Boolean;
  shadowRadius?: number;
  children?: any;
  round?: boolean;
  size?: number;
  row?: boolean;
  flexWeight?: number;
  xAlign?: "center" | "space-between" | "flex-start" | "flex-end" | "stretch";
  yAlign?: "center" | "space-between" | "flex-start" | "flex-end" | "stretch";
  mb?: number;
  mt?: number;
  p?: number;
  m?: number;
  ml?: number;
  mr?: number;
  style?: ViewStyle;
  screen?: boolean;
}

// TODO - Put styles in context and if the style already exists,
// i should not create it again and instead reuse it
const View = ({
  shadow,
  shadowRadius,
  children,
  round,
  row,
  xAlign,
  yAlign,
  style,
  screen,
  flexWeight,
  size = 0,
  mb = 0,
  mt = 0,
  p = 0,
  m = 0,
  ml = 0,
  mr = 0,
  ...props
}: Props) => {
  const [themeState] = useTheme();

  const roundStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    justifyContent: "center",
    alignContent: "center",
  };
  const shadowStyle = {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
  };

  const structureStyle = {
    backgroundColor: screen ? themeState.color.screenBackground : "transparent",
    display: "flex",
    flexDirection: row ? "row" : "column",
    justifyContent: row ? xAlign : yAlign,
    alignItems: row ? yAlign : xAlign,
    flex: flexWeight,
  };

  const marginsStyle = {
    marginTop: mt,
    marginBottom: mb,
    marginRight: mr,
    marginLeft: ml,
    padding: p,
    margin: m,
  };

  const createStylesheet = () => {
    //Create only what we need and try to reuse what is on context
    const styleObj = {
      structure: structureStyle,
      margins: marginsStyle,
      shadow: shadow || shadowRadius ? shadowStyle : {},
      round: round ? roundStyle : {},
      customStyle: style,
    };

    return StyleSheet.create(styleObj);
  };

  const styles = createStylesheet();

  return (
    <RNView
      {...props}
      style={[
        styles.structure,
        styles.margins,
        styles.shadow,
        styles.round,
        styles.customStyle,
      ]}
    >
      {children}
    </RNView>
  );
};

export default View;
