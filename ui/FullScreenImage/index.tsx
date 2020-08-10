import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";

import { colors } from "resources";

export default ({ visible, image, close }) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          backgroundColor: colors.CUSTOM_BLACK_OVERLAY(0.5),
        }}
      >
        <TouchableHighlight onPress={close}>
          <View
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                width: undefined,
                height: undefined,
                backgroundColor: colors.CUSTOM_BLACK_OVERLAY(0.5),
                ...StyleSheet.absoluteFillObject,
              }}
              source={image}
              resizeMode="contain"
            />
          </View>
        </TouchableHighlight>
      </View>
    </Modal>
  );
};
