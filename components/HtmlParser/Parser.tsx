import React, { useEffect, useRef } from 'react';
import { Text, ScrollView, View, Linking } from 'react-native';
import HTML from 'react-native-render-html';

import SelectableText from './SelectableText';
import { PublicProps } from './types';
import { tagsStyles, classesStyles, styles } from './styles';
import useParser from './useParser';

function Parser(props: PublicProps) {
  // This variable be incremented in each selectable element to identify them
  var selectable = 0;

  const {
    onHighlight,
    highlightConfirmationDialog,
    newNoteText,
    updateNoteText,
    deleteNoteText,
    highlightColor,
    fontScale,
    theme,
  } = props;

  const scrollviewRef = useRef<ScrollView>(null);
  const anchorIdLayouts = useRef<any>({});
  const [state, dispatch] = useParser();

  useEffect(() => {
    setTimeout(() => props.onHtmlParsed(onLinkPress));
  }, []);

  // Force parsing html again when font and theme type changes
  useEffect(() => {
    
    dispatch.forceRerender();
  }, [fontScale, theme.type, JSON.stringify(state.highlights)]);

  // Reset the selectable variable to indicate we have one new html to parse
  useEffect(() => {
    selectable = 0;
  }, [state.html]);

  const onLinkPress = (href: string) => {
    if (!href) {
      return;
    }
    if (!anchorIdLayouts.current[href]) {
      return Linking.openURL(href).catch((e) => console.log(e));
    }

    // TODO - THE OFFSET SHOULD NOT BE HARDCODED
    anchorIdLayouts.current[href].measureInWindow((x: number, y: number) => {
      scrollviewRef?.current!.scrollTo({
        animated: true,
        y: y - 90,
      });
    });
  };

  const renderP = (htmlAttribs, children, convertedCSSStyles) => {
    return (
      <Text
        style={convertedCSSStyles}
        onPress={() => onLinkPress(htmlAttribs.href)}>
        {children}
      </Text>
    );
  };

  const renderAnchor = (
    htmlAttribs,
    children,
    convertedCSSStyles,
    passProps,
  ) => {
    if (!htmlAttribs.id) {
      return renderP(htmlAttribs, children, convertedCSSStyles);
    }
    return (
      <View
        key={passProps.key}
        ref={(r: any) => {
          anchorIdLayouts.current[htmlAttribs.id] = r;
        }}
        htmlAttribs={htmlAttribs}
        children={children}
        convertedCSSStyles={convertedCSSStyles}
        {...passProps}
      />
    );
  };

  const renderSelectable = (htmlAttribs, children, convertedCSSStyles) => {
    selectable = selectable + 1;
    const _selectable = selectable;

    if (htmlAttribs.class !== 'selectable') {
      return renderP(htmlAttribs, children, convertedCSSStyles);
    }

    const onSelection = (opts) => {
      const highlight = {
        ...opts,
        elementId: opts.elementId || _selectable,
      };

      const mapper = {
        [newNoteText]: dispatch.addHighlight,
        [updateNoteText]: dispatch.updateHighlights,
        [deleteNoteText]: dispatch.deleteHighlight,
      };

      if (highlightConfirmationDialog && opts.eventType !== deleteNoteText) {
        return dispatch.toggleHighlightConfirmation(highlight);
      }

      const res = mapper[opts.eventType](highlight);
      onHighlight(res);
    };

    return (
      <SelectableText
        id={selectable}
        menuItems={[newNoteText]}
        highlightMenuItems={[updateNoteText, deleteNoteText]}
        onSelection={onSelection}
        value={children}
        highlights={state.highlights[selectable]}
        highlightColor={highlightColor}
        onHighlightRef={(ref, key) => {
          anchorIdLayouts.current[key] = ref;
        }}
        selectable
      />
    );
  };

  const onHighlightConfirm = (payload: highlight) => {
    const highlight = { ...state.confirmationHighlight, payload };
    const mapper = {
      [newNoteText]: dispatch.addHighlight,
      [updateNoteText]: dispatch.updateHighlights,
      [deleteNoteText]: dispatch.deleteHighlight,
    };

    const res = mapper[state.confirmationHighlight.eventType](highlight);
    onHighlight(res);
  };

  return (
    <>
      {state.confirmationHighlight &&
        highlightConfirmationDialog &&
        highlightConfirmationDialog(
          state.confirmationHighlight,
          onHighlightConfirm,
          dispatch.toggleHighlightConfirmation,
        )}
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.backgroundColor, padding: 10 }}
        ref={scrollviewRef}>
        <HTML
          style={styles.container}
          tagsStyles={tagsStyles(fontScale, theme)}
          classesStyles={classesStyles}
          html={state.html}
          renderers={{
            p: renderSelectable,
            a: renderAnchor,
          }}
        />
      </ScrollView>
    </>
  );
}

export default Parser;
