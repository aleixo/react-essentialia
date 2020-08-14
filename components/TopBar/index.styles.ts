import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  mainContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    zIndex: 1,
  },
  topLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 3,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
