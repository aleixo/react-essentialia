import React, { useContext, useState } from 'react';
import context from '../context';
import { View as RNView, StyleSheet, ViewProps } from 'react-native';
import { Uuid } from '../../helpers';

interface Props extends ViewProps {
  shadow?: Boolean;
  shadowRadius?: number;
  children: any;
  round?: boolean;
  size?: number;
  row?: boolean;
  flexWeight?: number;
  xAlign?: 'center' | 'space-between' | 'flex-start' | 'flex-end' | 'stretch';
  yAlign?: 'center' | 'space-between' | 'flex-start' | 'flex-end' | 'stretch';
  mb?: number;
  p?: number;
  m?: number;
}

// TODO - Put styles in context and if the style already exists,
// i should not create it again and instead reuse it
const View = ({
  shadow,
  shadowRadius,
  children,
  style,
  round,
  row,
  xAlign,
  yAlign,
  flexWeight = 1,
  size = 0,
  mb = 0,
  p = 0,
  m = 0,
  ...props
}: Props) => {
  const contextValue = useContext(context);
  const [name] = useState('view_' + Uuid());

  const DEFAULT_SHADOW_RADIUS = 2.62;
  const roundStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignContent: 'center',
  };
  const shadowStyle = {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.33,
    shadowRadius: shadowRadius || DEFAULT_SHADOW_RADIUS,
  };

  const structureStyle = {
    display: 'flex',
    flexDirection: row ? 'row' : 'column',
    justifyContent: xAlign,
    alignItems: yAlign,
    flex: flexWeight,
  };

  const marginsStyle = {
    marginBottom: mb,
    padding: p,
    margin: m,
  };

  const createStylesheet = () => {
    //Create only what we need and try to reuse what is on context
    const styleObj = {
      structure: structureStyle,
      margins: marginsStyle,
      shadow: shadow || shadowRadius ? shadowStyle : {},
      round: round ? roundStyle : {},
      extensions: contextValue.styleExtensions.view,
      customStyle: style,
    };

    return StyleSheet.create(styleObj);
  };

  if (!contextValue.styles[name]) {
    contextValue.styles[name] = createStylesheet();
  }

  return (
    <RNView
      {...props}
      style={[
        contextValue.styles[name].structure,
        contextValue.styles[name].margins,
        contextValue.styles[name].shadow,
        contextValue.styles[name].round,
        contextValue.styles[name].customStyle,
        contextValue.styles[name].extensions,
      ]}>
      {children}
    </RNView>
  );
};

export default View;
