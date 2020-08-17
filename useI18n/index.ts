import useI18n from "./hook";
import { I18nProvider } from "./context";
import { objects } from "../helpers";
const getString = objects.byString;

export default useI18n;
export { I18nProvider, getString };
