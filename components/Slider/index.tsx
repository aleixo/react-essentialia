import React, { useState, useRef, useEffect } from "react";

import { View, FlatList } from "react-native";

import styles from "./index.styles";
import { lookup } from "dns";

interface ISlider {
  datasource: object[];
  onRender(item: object): any;
  autoplayInterval?: number;
  loop?: boolean;
  autoplay?: boolean;
  bounces?: boolean;
  defaultPaginationInactiveColor?: string;
  defaultPaginationActiveColor?: string;
  renderCustomPagination?(index: number): void;
  onIndexChange(): void;
  overridePagination?: any;
  height?: number;
}
let autoPlayIntervalRef: any = null;
let scrollStartAt: any;

const Slider = ({
  autoplay,
  autoplayInterval,
  loop,
  datasource,
  onRender,
  onIndexChange,
  renderCustomPagination,
  overridePagination,
  defaultPaginationInactiveColor,
  defaultPaginationActiveColor,
  height,
  bounces,
}: ISlider) => {
  let listRef = useRef();
  const [state, dispatch] = useState({
    currentIndex: 0,
    layout: { width: 0 },
    listKey: `${Math.random()}`,
  });
  useEffect(() => {
    autoplay && _startAutoplay(autoplayInterval);

    return () => clearInterval(autoPlayIntervalRef);
  }, []);

  useEffect(() => {
    onIndexChange();
  }, [state.currentIndex]);

  /**
   * This function starts the autoplay, if the autoplay prop is true.
   *
   * The autoplay is started for the given interval time.
   *
   * @param {number }interval - The inteval in milliseconds
   */
  const _startAutoplay = (interval) => {
    const autoplayHandler = () => {
      state.currentIndex = _nextIndexLeft();
      _updateIndexState(state.currentIndex, onIndexChange);
      listRef &&
        listRef.current.scrollToIndex({
          animated: true,
          index: state.currentIndex,
        });
    };

    clearInterval(autoPlayIntervalRef);
    autoPlayIntervalRef = setInterval(autoplayHandler, interval);
  };

  /**
   * This function is responsible to decide what will be the next index
   * when we are playing to right.
   *
   * @returns {number} - The next index number
   */
  const _nextIndexRight = () => {
    const nextObviousIndex = state.currentIndex - 1;

    if (!loop && nextObviousIndex < 0) {
      return state.currentIndex;
    }
    return nextObviousIndex < 0 ? datasource.length - 1 : nextObviousIndex;
  };

  /**
   * This function is responsible to decide what will be the next index
   * when we are playing to left.
   *
   * @returns {number} - The next index number
   */
  const _nextIndexLeft = () => {
    const nextObviousIndex = state.currentIndex + 1;

    if (!loop && nextObviousIndex > datasource.length - 1) {
      return state.currentIndex;
    }
    return nextObviousIndex > datasource.length - 1 ? 0 : nextObviousIndex;
  };

  /**
   * This function is used by the FlatList to render the next item
   *
   * It will also soround the item with one view that as the widht of the window.
   *
   * @param {Object} item - THe component to be mounted.
   */
  const _handleFlatListRenderItem = ({ item }) => {
    return <View style={styles.fullWidth}>{onRender(item)}</View>;
  };

  /**
   * This function handles the beggining of the touch.
   *
   * It is used to clear the current autoplay in order to prevent
   * autoplay during long press.
   *
   * @param {Object} event - The begin touch event.
   */
  const _handleTouchStart = () => {
    clearInterval(autoPlayIntervalRef);
  };

  const _handleTouchCancel = () => {
    autoplay && _startAutoplay(autoplayInterval);
  };
  /**
   * This function handles the ending of the touch.
   *
   * Used to restart the pause autoplay loop
   *
   * @param {Object} event - The end touch event.
   */
  const _handleTouchEnd = () => {
    autoplay && _startAutoplay(autoplayInterval);
  };

  /**
   * This function handles the beggining of the scroll.
   *
   * Used to cache the starting scroll to know the scroll direction.
   *
   * @param {Object} event - The begin scroll event.
   */
  const _handleScrollBegin = (event) => {
    scrollStartAt = event.nativeEvent.contentOffset.x;
    clearInterval(autoPlayIntervalRef);
  };

  /**
   * This function handles the scroll ending event.
   *
   * Here, the list has to scroll to the next element depending if the
   * scroll direction if RTL or LTR.
   *
   * Also if autoplay props is true, we need to restart the already stoped autplay,
   * and we need to update the state with the new index.
   *
   * @param {Object} event - The end scroll event.
   */
  const _handleScrollEnd = (event) => {
    let scrollingLeft = event.nativeEvent.contentOffset.x > scrollStartAt;

    if (event.nativeEvent.contentOffset.x === scrollStartAt) {
      scrollingLeft = state.currentIndex === 0 ? false : true;
    }

    state.currentIndex = scrollingLeft ? _nextIndexLeft() : _nextIndexRight();
    listRef.current.scrollToIndex({
      animated: true,
      index: state.currentIndex,
    });
    autoplay && _startAutoplay(autoplayInterval);

    _updateIndexState(state.currentIndex, onIndexChange);
  };

  /**
   * This function updates the component state with the current index
   * that is beeing show.
   *
   * If also calls onIndexChange property callback with the current index
   *
   * @param {number} newIndex - The new index to the state.
   * @param {function} onIndexChange - The callback to when the state has changed.
   */
  const _updateIndexState = (newIndex, onIndexChange) => {
    dispatch({ ...state, currentIndex: newIndex });
  };

  /**
   * This function stores the layout on the state
   *
   * @param {Object} event - The event containing the new layout info as nativeEvent.layout.
   */
  const _onViewLayout = (event) => {
    dispatch({ ...state, layout: event.nativeEvent.layout });
  };

  return (
    <View
      style={{
        flex: height ? 0 : 1,
        height: height,
      }}
      onLayout={_onViewLayout}
    >
      <FlatList
        horizontal
        listKey={state.listKey}
        keyExtractor={() => `${Math.random()}`}
        ref={listRef}
        data={datasource}
        renderItem={_handleFlatListRenderItem}
        showsHorizontalScrollIndicator={false}
        onTouchStart={_handleTouchStart}
        onTouchEnd={_handleTouchEnd}
        onScrollBeginDrag={_handleScrollBegin}
        onScrollEndDrag={_handleScrollEnd}
        onTouchCancel={_handleTouchCancel}
        onTouchEndCapture={_handleTouchCancel}
        pagingEnabled
        bounces={bounces}
      />
      <View onTouchStart={_handleTouchStart} onTouchEnd={_handleTouchEnd}>
        {renderCustomPagination && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: state.layout.width,
            }}
          >
            {renderCustomPagination(state.currentIndex)}
          </View>
        )}
        {overridePagination || (
          <View style={styles.defaultPaginationContainer}>
            {datasource.map((data, index) => (
              <View
                key={index}
                style={[
                  styles.defaultPaginationItem,
                  {
                    backgroundColor:
                      state.currentIndex === index
                        ? defaultPaginationActiveColor
                        : defaultPaginationInactiveColor,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

Slider.defaultProps = {
  autoplay: false,
  overridePagination: false,
  autoplayInterval: 3000,
  defaultPaginationActiveColor: "black",
  defaultPaginationInactiveColor: "white",
  children: [],
  onIndexChange: () => {},
  renderCustomPagination: () => {},
  loop: false,
  bounces: true,
};
export default Slider;
