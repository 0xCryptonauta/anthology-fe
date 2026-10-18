import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import {
  LocalePreference,
  ResolvedLocale,
  setLocale,
} from "@store/slices/dappSlice";
import { dictionaries, TranslationKey } from "./translations";

/**
 * Reads the OS/browser preferred languages and picks a supported locale.
 * Falls back to English for any language we have no dictionary for.
 */
export const detectBrowserLocale = (): ResolvedLocale => {
  const candidates: string[] = [];

  if (typeof navigator !== "undefined") {
    if (Array.isArray(navigator.languages)) {
      candidates.push(...navigator.languages);
    }
    if (navigator.language) {
      candidates.push(navigator.language);
    }
  }

  for (const candidate of candidates) {
    const lower = candidate.toLowerCase();
    if (lower === "es" || lower.startsWith("es-")) return "es";
    if (lower === "en" || lower.startsWith("en-")) return "en";
  }

  return "en";
};

/**
 * Resolves the persisted preference ("auto" | "en" | "es") into a concrete
 * locale. Anything unrecognized (e.g. older persisted stores) behaves as
 * "auto".
 */
export const resolveLocale = (pref?: LocalePreference): ResolvedLocale => {
  if (pref === "en" || pref === "es") return pref;
  return detectBrowserLocale();
};

export type TranslateFn = (
  key: TranslationKey,
  vars?: Record<string, string | number>
) => string;

export const useTranslation = () => {
  const dispatch = useAppDispatch();
  const localePref = useAppSelector((state) => state.dapp.locale);

  const locale = resolveLocale(localePref);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback<TranslateFn>(
    (key, vars) => {
      const template = dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
      if (!vars) return template;

      return template.replace(/\{(\w+)\}/g, (match, name) => {
        const value = vars[name];
        return value !== undefined ? String(value) : match;
      });
    },
    [locale]
  );

  const changeLocale = useCallback(
    (pref: LocalePreference) => {
      dispatch(setLocale(pref));
    },
    [dispatch]
  );

  return { t, locale, localePref, setLocale: changeLocale };
};
