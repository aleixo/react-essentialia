import React, { useState, useRef, useEffect } from "react";
import {
  FlatList,
  FlatListProps,
  View,
  PanResponder,
  Animated,
} from "react-native";

type TOnDrop = (item: any) => void;

interface IFlatList extends FlatListProps<any> {
  draggable?: boolean;
  onDrop?: TOnDrop;
}

function moveArrayItems(arr, from, to) {
  if (from === -1 || to === -1) {
    return arr;
  }
  return arr.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);
}

const LONG_PRESS_TIME = 500;

const List = ({ draggable, data, onDrop, ...flatListProps }: IFlatList) => {
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const [movedToIndex, setMovedToIndex] = useState(-1);
  const [listData, setListData] = useState(data);
  const [mode, setMode] = useState<"IDLE" | "LONG_PRESS" | "DRAGGING">("IDLE");

  const flatlistRef = useRef<FlatList<any>>(null);
  const dragValues: {
    scrollYContentOffset: number;
    draggableheight: number;
    listYOffset: number;
    draggingIndex: number;
    listHeight: number;
    currentY: number;
    longPressInterval?: NodeJS.Timeout;
  } = useRef({
    scrollYContentOffset: 0,
    draggableheight: 0,
    listYOffset: 0,
    draggingIndex: -1,
    listHeight: 0,
    currentY: 0,
    longPressInterval: undefined,
  }).current;
  const draggablePos = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (
          mode === "LONG_PRESS" &&
          currentDraggingIndex(gestureState.y0) === draggingIndex
        ) {
          return false;
        }

        return true;
      },

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero no

        setDraggingIndex(currentDraggingIndex(gestureState.y0));
        dragValues.longPressInterval = setTimeout(() => {
          Animated.event([{ y: draggablePos.y }])({
            y: gestureState.y0 - dragValues.draggableheight / 2,
          });

          startDragging();
        }, LONG_PRESS_TIME);
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}

        dragValues.currentY = gestureState.moveY;

        setMovedToIndex(currentDraggingIndex(gestureState.moveY));

        Animated.event([{ y: draggablePos.y }])({
          y: gestureState.moveY - dragValues.draggableheight / 2,
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        stopDragging();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        stopDragging();
      },
    })
  ).current;

  //When we move while dragging set the new dragging index and update the data with the new order
  useEffect(() => {
    setDraggingIndex(movedToIndex);
    setListData(moveArrayItems(listData, draggingIndex, movedToIndex));
  }, [movedToIndex]);

  // When updating the dragging index, start the infinite scroll
  useEffect(() => {
    infiniteScroll();
  }, [draggingIndex]);

  const infiniteScroll = () => {
    if (mode !== "DRAGGING") {
      return;
    }
    const THRESHOLD = 100;
    const SCROLL_OFFSET = 10;
    requestAnimationFrame(() => {
      if (
        dragValues.currentY + THRESHOLD < dragValues.listHeight &&
        dragValues.currentY > THRESHOLD
      ) {
        return;
      }

      const offset =
        dragValues.currentY < THRESHOLD
          ? dragValues.scrollYContentOffset - SCROLL_OFFSET
          : dragValues.scrollYContentOffset + SCROLL_OFFSET;
      flatlistRef.current?.scrollToOffset({
        animated: false,
        offset,
      });

      infiniteScroll();
    });
  };

  const currentDraggingIndex = (y) => {
    const res = Math.floor(
      (dragValues.scrollYContentOffset + y - dragValues.listYOffset) /
        dragValues.draggableheight
    );
    if (res <= -1 || res >= listData?.length) {
      return -1;
    }

    return res;
  };

  const startDragging = () => {
    dragValues.longPressInterval = undefined;
    setMode("DRAGGING");
  };

  const stopDragging = () => {
    if (dragValues.longPressInterval) {
      clearTimeout(dragValues.longPressInterval);
      setMode("LONG_PRESS");
      return;
    }

    setMode("IDLE");
    setDraggingIndex(-1);
    onDrop && onDrop(listData);
  };

  return (
    <>
      {mode === "DRAGGING" && (
        <Animated.View
          style={{
            position: "absolute",
            zIndex: 2,
            width: "100%",
            height: dragValues.draggableheight,
            backgroundColor: "red",
            top: draggablePos.getLayout().top,
            opacity: 0.9,
          }}
        >
          {flatListProps.renderItem &&
            flatListProps.renderItem({
              item: listData[draggingIndex],
            })}
        </Animated.View>
      )}
      <FlatList
        {...flatListProps}
        ref={flatlistRef}
        data={listData}
        onScroll={(e) => {
          dragValues.scrollYContentOffset = e.nativeEvent.contentOffset.y;
        }}
        onLayout={(e) => {
          dragValues.listYOffset = e.nativeEvent.layout.y;
          dragValues.listHeight = e.nativeEvent.layout.height;
        }}
        scrollEnabled={mode !== "DRAGGING"}
        renderItem={({ item, index }) => (
          <View
            {...panResponder.panHandlers}
            onLayout={(e) => {
              dragValues.draggableheight = e.nativeEvent.layout.height;
            }}
          >
            {flatListProps.renderItem &&
              flatListProps.renderItem({
                item,
                isDragging: index === draggingIndex && mode !== "LONG_PRESS",
                longPressed: index === draggingIndex && mode === "LONG_PRESS",
              })}
          </View>
        )}
      />
    </>
  );
};

export default List;
