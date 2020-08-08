import React from "react";
import { View, Button, Text, Switch } from "react-native";

const ContextPopup: React.FC = ({ backgroundColor }) => {
  return (
    <View
      style={{
        position: "absolute",
        right: 10,
        zIndex: 2222,
        backgroundColor: backgroundColor,
        minHeight: 190,
        minWidth: 220,
        borderRadius: 10,
      }}
    >
      <View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <View
          style={{
            flex: 0.1,
            borderBottomWidth: 1,
            borderBottomColor: themeState.colors.border,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 0.5,
              borderRightWidth: 1,
              borderRightColor: themeState.colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              title="T"
              onPress={() => themeDispatcher.changeFontScale(1)}
            />
          </View>
          <View
            style={{
              flex: 0.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              title="T"
              onPress={() => themeDispatcher.changeFontScale(2)}
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.35,
            borderBottomColor: themeState.colors.border,
            borderBottomWidth: 1,
          }}
        ></View>
        <View
          style={{
            flex: 0.35,
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
          }}
        >
          <Text>Auto night Theme</Text>
          <Switch
            trackColor={{
              true: themeState.colors.primary,
              false: themeState.colors.border,
            }}
            onValueChange={() => {
              themeDispatcher.toggleDarkMode();
              dispatch({
                ...state,
                nightModeEnabled: !state.nightModeEnabled,
              });
            }}
            value={state.nightModeEnabled}
          />
        </View>
      </View>
    </View>
  );
};

export default ContextPopup;
