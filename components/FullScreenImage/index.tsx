import React from "react";
import {
  Modal,
  View,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";

interface IFullScreenImage {
  visible?: boolean;
  image?: string;
  backgroundColor: string;
  close(): void;
}

export default ({
  visible,
  image,
  close,
  backgroundColor,
}: IFullScreenImage) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          backgroundColor: backgroundColor,
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
                backgroundColor: backgroundColor,
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
