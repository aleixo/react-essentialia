import Parser from "./Parser";
import useParser from "./useParser";

import { withProvider } from "./context";

const HtmlParser = withProvider(Parser);

export default {
  HtmlParser,
  useParser,
};
