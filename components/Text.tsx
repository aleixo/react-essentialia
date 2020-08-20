import React, { useContext } from "react";
import { Text as RNText, TextProps } from "react-native";

import * as types from "../types";
import context from "../context";
import { useI18n } from "../useI18n";
import { useTheme } from "../useTheme";

interface Props extends TextProps {
  children: any;
  bold?: boolean;
  center?: boolean;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  paragraph?: boolean;
  label?: boolean;
}

const defaults = {};

const buildStyle = (
  { color, sizes }: types.IThemeState,
  name: string,
  opts
) => {
  const fontWeight = (bold: boolean) => {
    if (bold) {
      return "bold";
    }
    return "normal";
  };

  const textAlign = () => {
    return "center";
  };

  const baseStyle = ({ bold }) => ({
    fontWeight: fontWeight(bold),
    textAlign: textAlign(),
  });

  const sizeMapper = {
    h1: "XL",
    h2: "L",
    h3: "M",
    h4: "S",
    h5: "XS",
    h6: "XXS",
    label: "label",
    paragraph: "paragraph",
  };

  const componentDefault = {
    color: color.text,
    fontSize: sizes[sizeMapper[name]],
    fontFamily: undefined,
    borderWidth: 0,
  };

  return {
    ...defaults,
    ...componentDefault,
    ...baseStyle(opts),
  };
};

export default ({
  children,
  bold,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  paragraph,
  label,
  ...props
}: Props) => {
  const [, i18nDispatcher] = useI18n();
  const [themeState] = useTheme();

  const contextObj = useContext(context);

  const ownChildren = i18nDispatcher.getString(children) || children;

  const sizesObject = { h1, h2, h3, h4, h5, h6, paragraph, label };
  const size = Object.keys(sizesObject).find((key) => sizesObject[key]) || "h1";

  const styles = buildStyle(themeState, size, { bold });
  return (
    <RNText
      {...props}
      style={{
        ...styles,
        ...props.style,
      }}
    >
      {ownChildren}
    </RNText>
  );
};
