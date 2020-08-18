import useI18n from "./useI18n";
import useDispatcher from "./useDispatcher";
import { I18nProvider } from "./context";
import { objects } from "../helpers";
const getString = objects.byString;

export { I18nProvider, getString, useDispatcher, useI18n };
