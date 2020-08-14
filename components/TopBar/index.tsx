import React from "react";
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
  native?: boolean;
  enable?: boolean;
  fadeoutAfter?: number;
  fadeoutDuration?: number;
  fadeout?: boolean;
}

class TopBar extends React.Component<ITopBar> {
  constructor(props: ITopBar) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0),
    };

    this.toolbarAnimation = {
      toValue: props.toHeight,
      duration: props.fadeinDuration,
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        const { toHeight } = this.props;

        if (gestureState.moveY < toHeight) {
          Animated.timing(this.state.fadeAnim, {
            toValue: gestureState.moveY,
            duration: 0,
          }).start();
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { swipeDuration } = this.props;
        const {
          toHeight,
          onFadeIn,
          onFadeOut,
          willFadeOut,
          willFadeIn,
        } = this.props;
        const toValue = gestureState.moveY < toHeight / 2 ? 0 : toHeight;
        const closing = toValue === 0;

        closing ? willFadeOut() : willFadeIn();

        Animated.timing(this.state.fadeAnim, {
          toValue,
          duration: 200,
        }).start(() => {
          this.isOpened = !closing;
          closing ? onFadeOut() : onFadeIn();
        });
      },
    });
  }

  componentDidMount() {
    const { enable } = this.props;
    if (!enable) {
      return;
    }

    this.runAnimations();
  }

  componentDidUpdate(prevProps) {
    const hasEnabled =
      this.props.enable && this.props.enable !== prevProps.enable;

    hasEnabled && this.runAnimations();
  }

  runAnimations = () => {
    const { fadeout, fadeoutDuration } = this.props;

    this.fadeIn(() => {
      fadeout && this.fadeOut(fadeoutDuration);
    });
  };

  fadeIn = (next) => {
    if (this.isOpened) {
      return;
    }
    const { willFadeIn, onFadeIn } = this.props;
    willFadeIn();
    Animated.timing(this.state.fadeAnim, this.toolbarAnimation).start(() => {
      this.isOpened = true;
      next && next();
      onFadeIn();
    });
  };

  fadeOut = (duration) => {
    if (!this.isOpened) {
      return;
    }

    const { fadeoutAfter, onFadeOut, willFadeOut, toHeight } = this.props;
    const toolbarFadeoutAnimation = {
      toValue: 0,
      duration,
    };

    willFadeOut();
    setTimeout(
      () =>
        Animated.timing(this.state.fadeAnim, toolbarFadeoutAnimation).start(
          () => {
            onFadeOut();
            this.isOpened = false;
          }
        ),
      fadeoutAfter
    );
  };

  render() {
    const { fadeAnim } = this.state;
    const {
      image,
      renderContent,
      backgroundColor,
      opacity,
      toWidth,
    } = this.props;
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
          {...(this.props.swipable && this._panResponder.panHandlers)}
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
  }
}

TopBar.defaultProps = {
  enable: true,
  swipeDuration: 300,
  willFadeOut: () => {},
  willFadeIn: () => {},
  onFadeIn: () => {},
  onFadeOut: () => {},
};

export default TopBar;
