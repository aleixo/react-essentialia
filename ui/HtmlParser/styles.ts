import { StyleSheet } from "react-native";

const schemeStyles = (theme) => {
  const mapper = {
    light: {
      color: "#000",
    },
    normal: {
      color: "#000",
    },
    dark: {
      color: "#fff",
    },
    default: {
      color: "#000",
    },
  };

  return mapper[theme.type] ? mapper[theme.type] : mapper.default;
};

const tagsStyles = (scale: number, theme: Object) => {
  const shemeStyles = schemeStyles(theme);
  return {
    h1: {
      fontSize: 36 * scale,
      fontWeight: "bold",
      color: shemeStyles.color,
      marginVertical: 15,
    },
    h2: {
      fontSize: 22 * scale,
      fontWeight: "bold",
      color: shemeStyles.color,
      marginVertical: 10,
    },
    h3: {
      fontSize: 16 * scale,
      fontWeight: "bold",
      color: shemeStyles.color,
      marginTop: 15,
      marginBottom: 5,
    },
    a: {
      color: "red",
      textDecorationLine: "none",
      margin: 0,
      padding: 0,
    },
    p: {
      color: shemeStyles.color,
      fontSize: 16 * scale,
      lineHeight: 28,
      margin: 0,
      marginBottom: 10,
    },
    span: {
      color: shemeStyles.color,
      margin: 0,
      fontSize: 16 * scale,
      lineHeight: 28,
    },
    ul: {
      margin: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      padding: 0,
    },
    li: {
      margin: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      padding: 0,
    },
  };
};

const classesStyles = {
  card: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderWidth: 0.5,
    borderColor: "#444",
    borderRadius: 5,
  },
  content: {
    marginTop: 15,
    marginBottom: 30,
  },
  bold: {
    fontWeight: "bold",
  },
  thin: {
    fontWeight: "200",
  },
  small: {
    fontSize: 12,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 1,
  },
});

export { tagsStyles, classesStyles, styles };
