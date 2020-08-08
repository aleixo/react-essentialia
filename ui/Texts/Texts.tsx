import React, { useContext } from 'react';
import { Text } from 'react-native';

import * as types from '../types';
import context from '../context';

interface TextProps {
  children: any;
  bold?: boolean;
  center?: boolean;
}

const defaults = {};

const buildStyle = ({ colors, sizes }: types.state, name: string, opts) => {
  const fontWeight = (bold) => {
    if (bold) {
      return 'bold';
    }
    return '';
  };

  const textAlign = (center) => {
    if (center) {
      return 'center';
    }

    return '';
  };

  const baseStyle = ({ bold, center }) => ({
    fontWeight: fontWeight(bold),
    textAlign: textAlign(center),
  });

  const sizeMapper = {
    h1: 'XL',
    h2: 'L',
    h3: 'M',
    h4: 'S',
    h5: 'XS',
    h6: 'XXS',
    label: 'label',
    paragraph: 'paragraph',
  };

  const componentDefault: TextStyle = {
    color: colors.text,
    fontSize: sizes[sizeMapper[name]],
    fontFamily: undefined,
    borderWidth: 0,
  };

  return {
    ...defaults,
    ...componentDefault,
    ...baseStyle(opts),
  };
};

export const H1 = ({ children, bold }: TextProps) => {
  const contextObj = useContext(context);
  const styles = buildStyle(contextObj.state, 'h1', { bold });
  return (
    <Text style={{ ...styles, ...contextObj.styleExtensions?.h1 }}>
      {children}
    </Text>
  );
};

export const H2 = ({ children, bold }: TextProps) => {
  const contextObj = useContext(context);
  const styles = buildStyle(contextObj.state, 'h2', { bold });
  return (
    <Text style={{ ...styles, ...contextObj.styleExtensions?.h2 }}>
      {children}
    </Text>
  );
};

export const H3 = ({ children, bold }: TextProps) => {
  const contextObj = useContext(context);
  const styles = buildStyle(contextObj.state, 'h3', { bold });
  return (
    <Text style={{ ...styles, ...contextObj.styleExtensions?.h3 }}>
      {children}
    </Text>
  );
};

export const H4 = ({ children, bold }: TextProps) => {
  const contextObj = useContext(context);
  const styles = buildStyle(contextObj.state, 'h4', { bold });
  return (
    <Text style={{ ...styles, ...contextObj.styleExtensions?.h4 }}>
      {children}
    </Text>
  );
};

export const H5 = ({ children, bold }: TextProps) => {
  const contextObj = useContext(context);
  const styles = buildStyle(contextObj.state, 'h5', { bold });
  return (
    <Text style={{ ...styles, ...contextObj.styleExtensions?.h5 }}>
      {children}
    </Text>
  );
};

export const H6 = ({ children, bold }: TextProps) => {
  const contextObj = useContext(context);
  const styles = buildStyle(contextObj.state, 'h6', { bold });
  return (
    <Text style={{ ...styles, ...contextObj.styleExtensions?.h6 }}>
      {children}
    </Text>
  );
};

export const Paragraph = ({ children, bold }: TextProps) => {
  const contextObj = useContext(context);
  const styles = buildStyle(contextObj.state, 'paragraph', { bold });
  return (
    <Text style={{ ...styles, ...contextObj.styleExtensions?.paragraph }}>
      {children}
    </Text>
  );
};

export const Label = ({ children, bold, center }: TextProps) => {
  const contextObj = useContext(context);
  const styles = buildStyle(contextObj.state, 'label', { bold, center });
  return (
    <Text style={{ ...styles, ...contextObj.styleExtensions?.label }}>
      {children}
    </Text>
  );
};
