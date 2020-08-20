import React, { useContext, useState } from "react";

import {
  View,
  TouchableOpacity,
  ButtonProps,
  ViewStyle,
  ColorPropType,
  TextStyle,
} from "react-native";

import Text from "./Text";
import context from "../context";
import { useI18n } from "../useI18n";
import { useTheme } from "../useTheme";
import { IColor, sizes, TAllowedModifiers } from "../types";

const modifierStyle = (
  modifiers: string,
  opts: { size: number; color: IColor; providerModifiers }
) => {
  const modifiersStyles: {
    [key in string]: ViewStyle;
  } = {
    success: {
      backgroundColor: opts.color.success,
    },
    error: {
      backgroundColor: opts.color.error,
    },
    warn: {
      backgroundColor: opts.color.warn,
    },
    round: {
      backgroundColor: opts.color.backgroundColor,
      borderRadius: opts.size / 2,
      width: opts.size,
      height: opts.size,
      borderColor: opts.color.border,
      borderWidth: 1,
    },
    bordered: {
      borderColor: opts.color.border,
      borderWidth: 1,
      borderRadius: 10,
    },
  };

  const textModifiersStyles: { [key in string]: TextStyle } = {
    default: {
      color: opts.color.text,
    },
    round: {
      padding: 10,
    },
    bordered: {
      padding: 10,
    },
  };

  const predifinedModifiers = {
    touchable: modifiers.split(" ").reduce((acc, val) => {
      return { ...acc, ...modifiersStyles[val] };
    }, {}),
    text: modifiers.split(" ").reduce(
      (acc, val) => {
        return { ...acc, ...textModifiersStyles[val] };
      },
      { ...textModifiersStyles.default }
    ),
  };

  const customModifiers = modifiers.split(" ").reduce((acc, val) => {
    if (!opts.providerModifiers[val]) {
      return acc;
    }
    return {
      ...opts.providerModifiers[val],
    };
  }, {});

  return {
    touchable: {
      ...predifinedModifiers.touchable,
    },
    text: {
      ...predifinedModifiers.text,
      // Here goes the custom modifiers. Always compare if we have already
      color: customModifiers.color
        ? customModifiers.color
        : predifinedModifiers.text.color,
    },
  };
};

interface Props extends ButtonProps {
  onPress?: Function;
  size?: number;
  width?: number;
  height?: number;
  children?: any;
  marginHorizontal?: number;
  padding?: number;
  title?: string;
  langToggle?: string[];
  fontScaleToggle?: number[];
  themeToggle?: string[];
  modifiers?: string;
}

const Button = ({
  children,
  // Context properties
  title,
  size,
  width,
  height,
  //Margins and paddings
  marginHorizontal,
  padding,
  // Callbacks
  onPress,
  langToggle,
  fontScaleToggle,
  themeToggle,
  modifiers = "",
  ...props
}: Props) => {
  const [state, dispatch] = useState<{
    i18nIndex: number;
    fontScaleIndex: number;
    themeIndex: number;
  }>({
    i18nIndex: 0,
    fontScaleIndex: 0,
    themeIndex: 0,
  });
  const [, i18nDispatch] = useI18n();
  const [themeState, themeDispatch] = useTheme();
  const contextObj = useContext(context);

  const onTouchablePress = (evt: any) => {
    if (Array.isArray(langToggle)) {
      i18nDispatch.setLanguage(langToggle[state.i18nIndex]);
      dispatch({
        ...state,
        i18nIndex:
          state.i18nIndex + 1 >= langToggle.length ? 0 : state.i18nIndex + 1,
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

    if (Array.isArray(themeToggle)) {
      themeDispatch({
        ...themeState,
        theme: themeToggle[state.themeIndex],
      });

      dispatch({
        ...state,
        themeIndex:
          state.themeIndex + 1 >= themeToggle.length ? 0 : state.themeIndex + 1,
      });
    }
    onPress && onPress(evt);
  };

  const providerModifiers = contextObj.state.modifiers(themeState.color);

  const modifier = modifierStyle(modifiers, {
    color: themeState.color,
    size,
    providerModifiers,
  });

  return (
    <TouchableOpacity
      {...props}
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal,
        width: width,
        height: height,
        padding,
        ...modifier.touchable,
        ...props.style,
      }}
      onPress={onTouchablePress}
    >
      <Text
        label
        style={{
          ...modifier.text,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
