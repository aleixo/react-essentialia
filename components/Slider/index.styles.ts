import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  defaultPaginationContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
  },
  defaultPaginationItem: {
    borderRadius: 6 / 2,
    width: 6,
    height: 6,
    marginHorizontal: 1,
    backgroundColor: "blue",
  },
  paginationContainer: {
    bottom: 0,
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  fullWidth: {
    width: Dimensions.get("window").width,
  },
});
