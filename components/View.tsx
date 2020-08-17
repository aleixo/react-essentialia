import React, { useContext, useState } from "react";
import { View as RNView, StyleSheet, ViewProps, ViewStyle } from "react-native";

import context from "../context";
import { Uuid } from "../helpers";

interface Props extends ViewProps {
  shadow?: Boolean;
  shadowRadius?: number;
  children: any;
  round?: boolean;
  size?: number;
  row?: boolean;
  flexWeight?: number;
  xAlign?: "center" | "space-between" | "flex-start" | "flex-end" | "stretch";
  yAlign?: "center" | "space-between" | "flex-start" | "flex-end" | "stretch";
  mb?: number;
  p?: number;
  m?: number;
  style?: ViewStyle;
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
  flexWeight = 1,
  size = 0,
  mb = 0,
  p = 0,
  m = 0,
  style,
  ...props
}: Props) => {
  const contextValue = useContext(context);
  const [name] = useState("view_" + Uuid());

  const DEFAULT_SHADOW_RADIUS = 2.62;
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
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.33,
    shadowRadius: shadowRadius || DEFAULT_SHADOW_RADIUS,
  };

  const structureStyle = {
    display: "flex",
    flexDirection: row ? "row" : "column",
    justifyContent: xAlign,
    alignItems: yAlign,
    flex: flexWeight,
  };

  const marginsStyle = {
    marginBottom: mb,
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
      extensions: contextValue.state.styleExtensions.view,
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
        styles.extensions,
      ]}
    >
      {children}
    </RNView>
  );
};

export default View;
