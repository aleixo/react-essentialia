import React, { useState } from 'react';
import { ViewStyle } from 'react-native';
import { Button, View } from 'libs/ui';

interface Props {
  backgroundColor: string;
  tabs: string[];
  renderTab(selectedTab: string, selectedTabIndex: number): void;
  containerStyle?: ViewStyle;
}

const Tabs = ({ backgroundColor, tabs, renderTab, containerStyle }: Props) => {
  const [state, dispatch] = useState({
    selectedTab: tabs[0],
    selectedTabIndex: 0,
  });
  const selectTab = (tab, index) => {
    dispatch({
      ...state,
      selectedTab: tab,
      selectedTabIndex: index,
    });
  };
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...containerStyle,
      }}>
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 5,
          padding: 2,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          height: 28,
          backgroundColor,
        }}>
        {tabs.map((tab, index) => (
          <Button
            title={tab}
            backgroundColor={
              state.selectedTab === tab ? 'white' : 'transparent'
            }
            onPress={() => selectTab(tab, index)}
            borderRadius={5}
            strech
          />
        ))}
      </View>
      <View style={{ marginVertical: 20 }}>
        {renderTab(state.selectedTab, state.selectedTabIndex)}
      </View>
    </View>
  );
};

export default Tabs;
