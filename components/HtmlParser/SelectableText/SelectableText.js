import React from 'react';
import { Text, requireNativeComponent, Platform } from 'react-native';

const RNSelectableText = requireNativeComponent('RNSelectableText');

/**
 * numbers: array({start: int, end: int, id: string})
 */
const combineHighlights = (n) => {
  const numbers = JSON.parse(JSON.stringify(n));
  return numbers
    .sort((a, b) => a.start - b.start || a.end - b.end)
    .reduce(function (combined, next) {
      if (!combined.length || combined[combined.length - 1].end < next.start)
        combined.push(next);
      else {
        var prev = combined.pop();
        combined.push({
          start: prev.start,
          end: Math.max(prev.end, next.end),
          id: next.id,
        });
      }
      return combined;
    }, []);
};

const generateRanges = (value, combinedHighlights, style = {}) => {
  const data = [];
  combinedHighlights.forEach(({ start, end }, idx) => {
    data.push({
      isHighlight: true,
      text: value.slice(start, end),
      style,
      start,
      end,
    });

    if (combinedHighlights[idx + 1]) {
      data.push({
        isHighlight: false,
        text: value.slice(end, combinedHighlights[idx + 1].start),
        style,
        start,
        end,
      });
    }
  });

  return data.filter((x) => x.text);
};

/**
 * value: string
 * highlights: array({start: int, end: int, id: any})
 */
const mapHighlightsRanges = (children, highlights) => {
  let value = '';
  let style = {};

  const combinedHighlights = combineHighlights(highlights);

  if (combinedHighlights.length === 0)
    return [
      {
        isHighlight: false,
        text: value,
        style,
      },
    ];

  if (Array.isArray(children)) {
    const fiber = children[0][0].props.children[0].props;
    value = fiber.children;
    style = fiber.style;
  }

  const data = [
    {
      isHighlight: false,
      text: value.slice(0, combinedHighlights[0].start),
      style,
    },
    ...generateRanges(value, combinedHighlights, style),
  ];

  data.push({
    isHighlight: false,
    text: value.slice(
      combinedHighlights[combinedHighlights.length - 1].end,
      value.length,
    ),
    start: combinedHighlights.start,
    style,
  });

  return data.filter((x) => x.text);
};

/**
 * Props
 * ...TextProps
 * onSelection: ({ content: string, eventType: string, selectionStart: int, selectionEnd: int }) => void
 * children: ReactNode
 * highlights: array({ id, start, end })
 * highlightColor: string
 * onHighlightPress: string => void
 */
export default SelectableText = ({
  onSelection,
  onHighlightPress,
  onHighlightReference,
  value,
  children,
  ...props
}) => {
  const onSelectionNative = ({
    nativeEvent: {
      content,
      eventType,
      selectionStart,
      selectionEnd,
      highlighedSelectionIndex,
    },
  }) => {
    onSelection &&
      onSelection({
        id: props.id,
        ...(props.highlights &&
          props.highlights.find((val, i) => i === highlighedSelectionIndex)),
        start: selectionStart,
        end: selectionEnd,
        content,
        eventType,
      });
  };

  const onHighlightPressNative = onHighlightPress
    ? Platform.OS === 'ios'
      ? ({ nativeEvent: { clickedRangeStart, clickedRangeEnd } }) => {
          if (!props.highlights || props.highlights.length === 0) return;

          const mergedHighlights = combineHighlights(props.highlights);

          const hightlightInRange = mergedHighlights.find(
            ({ start, end }) =>
              clickedRangeStart >= start - 1 && clickedRangeEnd <= end + 1,
          );

          if (hightlightInRange) {
            onHighlightPress(hightlightInRange.id);
          }
        }
      : onHighlightPress
    : () => {};
  return (
    <RNSelectableText
      {...props}
      onHighlightPress={onHighlightPressNative}
      selectable
      ref={(ref) => {
        props.onHighlightRef && props.onHighlightRef(ref, `${props.id}`);
      }}
      onSelection={onSelectionNative}>
      <Text selectable key={Math.random()}>
        {props.highlights && props.highlights.length > 0
          ? mapHighlightsRanges(value, props.highlights).map(
              ({ id, isHighlight, text, style, start }) => {
                const key = Math.random();
                return (
                  <Text
                    key={key}
                    selectable
                    style={
                      isHighlight
                        ? {
                            ...style,
                            backgroundColor: props.highlightColor,
                          }
                        : style
                    }>
                    {text}
                  </Text>
                );
              },
            )
          : value}
      </Text>
    </RNSelectableText>
  );
};
