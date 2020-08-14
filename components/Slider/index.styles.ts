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
    borderRadius: 5 / 2,
    width: 5,
    height: 5,
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
