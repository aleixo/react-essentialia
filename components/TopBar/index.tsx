import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  StatusBar,
  Animated,
  Dimensions,
  PanResponder,
  SafeAreaView,
} from "react-native";

import styles from "./index.styles";

interface ITopBar {
  image: string | { uri: string };
  backgroundColor: string;
  toHeight: number;
  fadeinDuration: number;
  enable?: boolean;
  fadeoutAfter?: number;
  fadeoutDuration?: number;
  fadeout?: boolean;
}

const TopBar = ({
  image,
  backgroundColor,
  toHeight,
  fadeinDuration,
  enable,
  fadeoutAfter,
  fadeoutDuration,
  fadeout,
  willFadeOut,
  willFadeIn,
  onFadeOut,
  onFadeIn,
  toWidth,
  open,
  renderContent,
  swipable,
  opacity,
}: ITopBar) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [state, dispatch] = useState({
    toolbarFadeInAnimation: {
      toValue: toHeight,
      duration: fadeinDuration,
      useNativeDriver: false,
    },
    toolbarFadeOutAnimation: {
      toValue: 0,
      duration: fadeoutDuration,
      useNativeDriver: false,
    },
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.moveY < toHeight) {
            Animated.timing(fadeAnim, {
              toValue: gestureState.moveY,
              duration: 0,
            }).start();
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          const toValue = gestureState.moveY < toHeight / 2 ? 0 : toHeight;
          const closing = toValue === 0;

          closing ? willFadeOut() : willFadeIn();

          Animated.timing(fadeAnim, {
            toValue,
            duration: 200,
          }).start(() => {
            closing ? onFadeOut() : onFadeIn();
          });
        },
      }),
    []
  );

  useEffect(() => {
    if (!enable) {
      return;
    }

    runAnimations();
  }, []);

  const runAnimations = () => {
    fadeIn(() => {
      fadeout && fadeOut(fadeoutDuration);
    });
  };
  const fadeIn = (next?: any) => {
    willFadeIn();
    Animated.timing(fadeAnim, state.toolbarFadeInAnimation).start(() => {
      next && next();
      onFadeIn();
    });
  };

  const fadeOut = (duration?: number) => {
    willFadeOut();
    Animated.timing(fadeAnim, state.toolbarFadeOutAnimation).start(() => {
      onFadeOut();
    });
  };

  useEffect(() => {
    open ? fadeIn() : fadeOut(fadeoutDuration);
  }, [open]);

  return (
    <View style={[styles.mainContainer, { top: 0 }]}>
      <Animated.View
        style={[
          styles.topLogoContainer,
          {
            width: Dimensions.get("window").width / (toWidth || 1.5),
            height: fadeAnim,
            backgroundColor,
            opacity,
          },
        ]}
        {...(swipable && panResponder.panHandlers)}
      >
        {renderContent && renderContent()}
        {image && (
          <SafeAreaView
            style={{
              paddingTop: StatusBar.currentHeight,
              marginBottom: 10,
            }}
          >
            <Animated.Image
              resizeMode="contain"
              source={image}
              style={{
                flex: 1,
                width: Dimensions.get("window").width / 1.5,
                height: fadeAnim,
              }}
            />
          </SafeAreaView>
        )}
      </Animated.View>
    </View>
  );
};

TopBar.defaultProps = {
  enable: true,
  swipeDuration: 300,
  willFadeOut: () => {},
  willFadeIn: () => {},
  onFadeIn: () => {},
  onFadeOut: () => {},
};

export default TopBar;
