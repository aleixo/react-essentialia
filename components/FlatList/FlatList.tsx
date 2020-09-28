import React, { useState, useRef, useEffect } from "react";
import {
  FlatList,
  FlatListProps,
  View,
  PanResponder,
  Animated,
} from "react-native";

type TOnDrop = (item: any) => void;
type TLockDrag = (item: any) => boolean;

interface IFlatList extends FlatListProps<any> {
  draggable?: boolean;
  onDrop?: TOnDrop;
  draggableOpacity?: number;
  lockDrag?: TLockDrag;
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
const PRESS_INTERVAL = 150;

const List = ({
  draggable,
  data,
  onDrop,
  draggableOpacity = 0.9,
  lockDrag,
  ...flatListProps
}: IFlatList) => {
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const [movedToIndex, setMovedToIndex] = useState(-1);
  const [listData, setListData] = useState(data);
  const [mode, setMode] = useState<
    "IDLE" | "LONG_PRESS" | "PRESS" | "DRAGGING"
  >("IDLE");

  const flatlistRef = useRef<FlatList<any>>(null);
  const dragValues: {
    scrollYContentOffset: number;
    draggableheight: number;
    listYOffset: number;
    draggingIndex: number;
    listHeight: number;
    currentY: number;
    currLongPressedId: number;
    longPressInterval?: NodeJS.Timeout;
    pressInterval?: NodeJS.Timeout;
    itemHeights: { [key in string]: number };
  } = useRef({
    scrollYContentOffset: 0,
    draggableheight: 0,
    listYOffset: 0,
    draggingIndex: -1,
    listHeight: 0,
    currentY: 0,
    currLongPressedId: -1,
    longPressInterval: undefined,
    pressInterval: undefined,
    itemHeights: {},
  }).current;
  const draggablePos = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // Prevent pan responder from stealing touches when long press mode
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
        const currIndex = currentDraggingIndex(gestureState.y0);
        setDraggingIndex(currIndex);
        setMode("IDLE");
        // Set long press interval
        dragValues.pressInterval = setTimeout(() => {
          dragValues.pressInterval = undefined;
        }, PRESS_INTERVAL);
        dragValues.longPressInterval = setTimeout(() => {
          Animated.event([{ y: draggablePos.y }])({
            y: gestureState.y0 - dragValues.itemHeights[currIndex] / 2,
          });

          startDragging();
        }, LONG_PRESS_TIME);
      },
      onPanResponderMove: (evt, gestureState) => {
        //Stop dragging when outside bounds
        if (
          gestureState.moveY < dragValues.listYOffset ||
          gestureState.moveY > dragValues.listHeight + dragValues.listYOffset
        ) {
          stopDragging();
          return;
        }
        dragValues.currentY = gestureState.moveY;
        const currIndex = currentDraggingIndex(gestureState.moveY);
        setMovedToIndex(currIndex);

        Animated.event([{ y: draggablePos.y }])({
          y: gestureState.moveY - dragValues.itemHeights[currIndex] / 2,
        });

        if (mode === "DRAGGING") {
          dragValues.itemHeights = {
            ...dragValues.itemHeights,
            [draggingIndex]: dragValues.itemHeights[currIndex],
            [currIndex]: dragValues.itemHeights[currIndex],
          };
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        stopDragging();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        stopDragging();
      },
    })
  ).current;

  //When we move while dragging set the new dragging index and update the data with the new order
  useEffect(() => {
    setDraggingIndex(movedToIndex);

    mode === "DRAGGING" &&
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
        dragValues.currentY > THRESHOLD + dragValues.listYOffset &&
        dragValues.currentY + THRESHOLD <
          dragValues.listHeight + dragValues.listYOffset
      ) {
        return;
      }

      const isOnTop = dragValues.currentY < THRESHOLD + dragValues.listYOffset;
      const offset = isOnTop
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
    const realY = dragValues.scrollYContentOffset + y - dragValues.listYOffset;

    let sizeCount = 0;
    for (let i = 0; i < listData?.length; i++) {
      const currSizeCount = dragValues.itemHeights[i];
      if (realY > sizeCount && realY < sizeCount + currSizeCount) {
        return i;
      }

      sizeCount = sizeCount + currSizeCount;
    }
    return -1;
  };

  const startDragging = () => {
    dragValues.longPressInterval = undefined;
    setMode("DRAGGING");
  };

  //ALTURAS DINAMICAS
  const stopDragging = () => {
    if (dragValues.longPressInterval) {
      dragValues.pressInterval ? setMode("PRESS") : setMode("LONG_PRESS");

      clearTimeout(dragValues.longPressInterval);
      dragValues.pressInterval && clearTimeout(dragValues.pressInterval);
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
            top: draggablePos.getLayout().top,
            opacity: draggableOpacity,
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
          dragValues.longPressInterval &&
            clearTimeout(dragValues.longPressInterval);
          dragValues.longPressInterval = undefined;
        }}
        onLayout={(e) => {
          dragValues.listYOffset = e.nativeEvent.layout.y;
          dragValues.listHeight = e.nativeEvent.layout.height;
        }}
        scrollEnabled={mode !== "DRAGGING"}
        renderItem={({ item, index }) => {
          let longPress = index === draggingIndex && mode === "LONG_PRESS";
          let pressed = index === draggingIndex && mode === "PRESS";
          if (dragValues.currLongPressedId === index && mode === "LONG_PRESS") {
            pressed = false;
            dragValues.currLongPressedId = -1;
          } else if (
            pressed &&
            dragValues.currLongPressedId === -1 &&
            mode === "LONG_PRESS"
          ) {
            dragValues.currLongPressedId = index;
          }
          return (
            <View
              {...(draggable ? panResponder.panHandlers : {})}
              onLayout={(e) => {
                dragValues.itemHeights = {
                  ...dragValues.itemHeights,
                  [index]: e.nativeEvent.layout.height,
                };
              }}
            >
              {flatListProps.renderItem &&
                flatListProps.renderItem({
                  item,
                  isDragging: index === draggingIndex && mode === "DRAGGING",
                  longPress,
                  pressed,
                })}
            </View>
          );
        }}
      />
    </>
  );
};

export default List;
