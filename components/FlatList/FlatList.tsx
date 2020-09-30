import React, { useRef, useEffect } from "react";
import {
  FlatList,
  FlatListProps,
  View,
  PanResponder,
  Animated,
} from "react-native";
import useList from "./useList";

type TOnDrop = (item: any) => void;
type TLockDrag = (item: any) => boolean;

interface IFlatList extends FlatListProps<any> {
  draggable?: boolean;
  onDrop?: TOnDrop;
  draggableOpacity?: number;
  lockDrag?: TLockDrag;
}

const LONG_PRESS_TIME = 500;
const PRESS_INTERVAL = 150;

/**
 * FlatList allowing  dragging items
 * 
 * - example of usage:
 * <FlatList
      draggable
      onDrop={(data) => {}}      
      style={{ marginBottom: 100, marginTop: 100, width: '100%', flex: 1 }}
      data={list}
      renderItem={({ item, isDragging, pressed, longPress }) => {
        return (
          <View
            style={{
              padding: 15,
              backgroundColor: item.color,
              opacity: isDragging ? 0 : 1,
              flexDirection: 'row',
              height: item.height,
              alignItems: 'center',
            }}>
            <Text>Olá - {item.num}</Text>
            <Text paragraph>LONG PRESSS {longPress ? 1 : 0}</Text>
            <Text paragraph>CLICK {pressed ? 1 : 0}</Text>
          </View>
        );
      }}
      keyExtractor={(item) => 'key' + item.num}
    />
 */
const List = ({
  draggable,
  data,
  onDrop,
  draggableOpacity = 0.9,
  lockDrag,
  ...flatListProps
}: IFlatList) => {
  const [
    { selectedIndex, mode, list, dropped },
    { setSelectedIndex, setMode, reorderList },
  ] = useList(data);

  const containerRef = useRef<View>(null);
  const flatlistRef = useRef<FlatList<any>>(null);

  const dragValues: {
    scrollYContentOffset: number;
    draggableheight: number;
    listYOffset: number;
    selectedIndex: number;
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
    selectedIndex: -1,
    listHeight: 0,
    currentY: 0,
    currLongPressedId: -1,
    longPressInterval: undefined,
    pressInterval: undefined,
    //TODO: -1 should never be read but looks like it is sometimes. Needs some attention.
    itemHeights: {
      ["-1"]: 0,
    },
  }).current;
  const draggablePos = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // Prevent pan responder from stealing touches when long press mode
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        const currIndex = currentselectedIndex(gestureState.y0);
        setSelectedIndex(currIndex);
        dragValues.selectedIndex = currIndex;
        dragValues.draggableheight = dragValues.itemHeights[currIndex];
        // Normal click
        dragValues.pressInterval = setTimeout(() => {
          dragValues.pressInterval = undefined;
        }, PRESS_INTERVAL);

        // Long press interval
        dragValues.longPressInterval = setTimeout(() => {
          Animated.event([{ y: draggablePos.y }], { useNativeDriver: false })({
            y: gestureState.y0 - dragValues.itemHeights[currIndex] / 2,
          });

          dragValues.selectedIndex = currIndex;
          startDragging(currIndex);
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
        const currIndex = currentselectedIndex(dragValues.currentY);

        // If the selected indexis diferent from the one we are detecting, we need to reorder the list
        if (dragValues.selectedIndex !== currIndex) {
          reorderList(dragValues.selectedIndex, currIndex);
          dragValues.itemHeights = {
            ...dragValues.itemHeights,
            [dragValues.selectedIndex]: dragValues.itemHeights[currIndex],
            [currIndex]: dragValues.itemHeights[dragValues.selectedIndex],
          };
          dragValues.selectedIndex = currIndex;
        }

        Animated.event([{ y: draggablePos.y }], { useNativeDriver: false })({
          y: gestureState.moveY - dragValues.itemHeights[currIndex] / 2,
        });
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

  useEffect(() => {
    dropped && onDrop && onDrop(list);
  }, [dropped]);

  // When updating the dragging index, start the infinite scroll
  useEffect(() => {
    infiniteScroll();
  }, [selectedIndex]);

  // Scroll when at the edge of the flatlist
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

  /**
   * Compute the index based on the current y
   *
   * If will use dragValues.itemHeights do see where the y is
   *
   * @param {number} y - The y to compute the index
   *
   * @returns {number} - The index
   */
  const currentselectedIndex = (y) => {
    const realY = dragValues.scrollYContentOffset + y - dragValues.listYOffset;

    let sizeCount = 0;
    for (let i = 0; i < list?.length; i++) {
      const currSizeCount = dragValues.itemHeights[i];
      if (realY >= sizeCount && realY <= sizeCount + currSizeCount) {
        return i;
      }

      sizeCount = sizeCount + currSizeCount;
    }
    return -1;
  };

  // delete longpressinterval and set mode to dragging
  const startDragging = (index: number) => {
    dragValues.longPressInterval = undefined;
    setMode("DRAGGING", index);
  };

  /**
   * Three event come from here
   *
   * - Normal press
   * - Long press
   * - Idle the responder
   */
  const stopDragging = () => {
    if (dragValues.longPressInterval) {
      dragValues.pressInterval
        ? setMode("PRESS", dragValues.selectedIndex)
        : setMode("LONG_PRESS", dragValues.selectedIndex);

      clearTimeout(dragValues.longPressInterval);
      dragValues.pressInterval && clearTimeout(dragValues.pressInterval);
      return;
    }

    setMode("IDLE");
  };

  return (
    <View
      ref={containerRef}
      onLayout={() => {
        containerRef.current.measureInWindow((x: number, y: number) => {
          dragValues.listYOffset = y;
        });
      }}
    >
      {mode === "DRAGGING" && (
        <Animated.View
          style={{
            position: "absolute",
            zIndex: 2,
            elevation: 2,
            width: "100%",
            top: draggablePos.getLayout().top,
            opacity: draggableOpacity,
          }}
        >
          {flatListProps.renderItem &&
            flatListProps.renderItem({
              item: list[selectedIndex],
            })}
        </Animated.View>
      )}
      <FlatList
        {...flatListProps}
        ref={flatlistRef}
        data={list}
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
          let longPress = index === selectedIndex && mode === "LONG_PRESS";
          let pressed = index === selectedIndex && mode === "PRESS";
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
              style={{ zIndex: 1, elevation: 1 }}
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
                  isDragging: index === selectedIndex && mode === "DRAGGING",
                  longPress,
                  pressed,
                })}
            </View>
          );
        }}
      />
    </View>
  );
};

export default List;
