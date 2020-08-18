import React, { useContext, useState } from "react";

import { View, TouchableOpacity, ButtonProps } from "react-native";

import Text from "./Text";
import context from "../context";
import { useI18n } from "../useI18n";
import { useTheme } from "../useTheme";

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
  title?: string;
  langToggle?: string[];
  fontScaleToggle?: number[];
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
  langToggle,
  fontScaleToggle,
  ...props
}: Props) => {
  const [state, dispatch] = useState<{
    i18nIndex: number;
    fontScaleIndex: number;
  }>({
    i18nIndex: 0,
    fontScaleIndex: 0,
  });
  const [i18nState, i18nDispatch] = useI18n();
  const [themeState, themeDispatch] = useTheme();
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
        onPress={(evt: any) => {
          // TODO - Refactor
          if (Array.isArray(langToggle)) {
            i18nDispatch.setLanguage(langToggle[state.i18nIndex]);
            dispatch({
              ...state,
              i18nIndex:
                state.i18nIndex + 1 >= langToggle.length
                  ? 0
                  : state.i18nIndex + 1,
            });
          }

          if (Array.isArray(fontScaleToggle)) {
            themeDispatch({
              ...themeState,
              fontScale: fontScaleToggle[state.fontScaleIndex],
            });

            dispatch({
              ...state,
              fontScaleIndex:
                state.fontScaleIndex + 1 >= fontScaleToggle.length
                  ? 0
                  : state.fontScaleIndex + 1,
            });
          }
          onPress && onPress(evt);
        }}
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
          <Text
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
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
