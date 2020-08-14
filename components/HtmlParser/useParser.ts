import { useContext, useState } from 'react';
import { highlight, state } from './types';
import { context } from './context';
import { highlights } from 'hooks/useHandbooks/types';

interface dispatchReturn {
  addHighlight(highlight: highlight): highlights;
  updateHighlights(highlight: highlight): highlights;
  deleteHighlight(highlight: highlight): highlights;
  toggleHighlightConfirmation(highlight?: highlight): void;
  forceRerender(): void;
}

const useParser = (): [state, dispatchReturn] => {
  const objectValue = useContext(context);
  const [state, dispatch] = useState<state>(objectValue.state);

  const addHighlight = (newHighlight: highlight): highlights => {
    const newHighlights = {
      ...state.highlights,
      [newHighlight.elementId]: [
        ...(state.highlights[newHighlight.elementId] || []),
        {
          ...newHighlight,
          id: Math.random(),
        },
      ],
    };

    dispatch({
      ...state,
      confirmationHighlight: undefined,
      highlights: newHighlights,
    });

    return newHighlights;
  };

  const updateHighlights = (newHighlight: highlight): highlights => {
    const newHighlights = {
      ...objectValue.state.highlights,
      [newHighlight.elementId]: state.highlights[newHighlight.elementId].map(
        (value: highlight) => {
          if (value.id === newHighlight.id) {
            return newHighlight;
          }

          return value;
        },
      ),
    };

    dispatch({
      ...state,
      confirmationHighlight: undefined,
      highlights: newHighlights,
    });

    return newHighlights;
  };

  const deleteHighlight = (newHighlight: highlight): highlights => {
    const newHighlights = {
      ...state.highlights,
      [newHighlight.elementId]: state.highlights[newHighlight.elementId].filter(
        (value: highlight) => value.id !== newHighlight.id,
      ),
    };
    dispatch({
      ...state,
      confirmationHighlight: undefined,
      highlights: newHighlights,
    });

    return newHighlights;
  };

  const toggleHighlightConfirmation = (highlight?: highlight | undefined) => {
    dispatch({
      ...state,
      confirmationHighlight: highlight,
    });
  };

  const forceRerender = () => {
    dispatch({
      ...state,
      html: state.html.replace('<', ' <'),
    });
  };

  const dispatcher = {
    addHighlight,
    updateHighlights,
    deleteHighlight,
    toggleHighlightConfirmation,
    forceRerender,
  };

  return [state, dispatcher];
};

export default useParser;
