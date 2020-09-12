import React, { useState, useEffect, useRef, useMemo } from "react";
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
  image?: string | { uri: string };
  backgroundColor: string;
  toHeight: number;
  fadeinDuration: number;
  enable?: boolean;
  fadeoutAfter?: number;
  fadeoutDuration?: number;
  swipable?: boolean;
  onFadeIn(): void;
  onFadeOut(): void;
  willFadeOut(): void;
  willFadeIn(): void;
  toWidth?: number;
  renderContent?(): any;
  opacity?: number;
}

const TopBar = ({
  fadeinDuration,
  fadeoutDuration,
  swipable,
  toHeight,
  fadeoutAfter,
  toWidth,
  backgroundColor,
  opacity,
  image,
  onFadeIn,
  onFadeOut,
  willFadeOut,
  willFadeIn,
  renderContent,
}: ITopBar) => {
  const toolbarAnimation = {
    toValue: toHeight,
    duration: fadeinDuration,
    useNativeDriver: false,
  };
  const [hideContent, setHideContent] = useState(false);
  const [fadedIn, setFadedIn] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const _panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
          // Hide content when reponder has enough movement
          setHideContent(gestureState.moveY < toHeight / 1.2);
          if (gestureState.moveY < toHeight) {
            Animated.timing(fadeAnim, {
              toValue: gestureState.moveY,
              duration: 0,
              useNativeDriver: false,
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
            useNativeDriver: false,
          }).start(() => {
            closing ? onFadeOut() : onFadeIn();
          });
        },
      }),
    []
  );

  useEffect(() => {
    runAnimations();
  }, []);

  const runAnimations = () => {
    fadeIn(() => {
      !!fadeoutAfter &&
        setTimeout(() => {
          fadeOut(fadeoutDuration);
        }, fadeoutAfter);
    });
  };

  const fadeIn = (next?: any) => {
    willFadeIn();
    Animated.timing(fadeAnim, toolbarAnimation).start(() => {
      next && next();
      onFadeIn();
      setFadedIn(true);
    });
  };

  const fadeOut = (duration = 0) => {
    const toolbarFadeoutAnimation = {
      toValue: 0,
      duration,
      useNativeDriver: false,
    };

    willFadeOut();
    Animated.timing(fadeAnim, toolbarFadeoutAnimation).start(onFadeOut);
  };

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
        {...(swipable && _panResponder.panHandlers)}
      >
        {fadedIn && renderContent && (hideContent || renderContent())}
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
  willFadeOut: () => {},
  willFadeIn: () => {},
  onFadeIn: () => {},
  onFadeOut: () => {},
  fadeoutDuration: 0,
};

export default TopBar;
