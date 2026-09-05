import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      brandHeadline: "One login. Zero excuses.",
      brandTagline: "Sign in to manage what you built at 2am.",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
      openLanguages: "Choose language",
      closeLanguages: "Close language menu",
      alertErrorTitle: "Couldn't sign in",
      alertWarningTitle: "Warning",
      alertSuccessTitle: "Success",
      alertInfoTitle: "Heads up",
    },
    de: {
      brandHeadline: "Ein Login. Keine Ausreden.",
      brandTagline: "Melde dich an, um zu verwalten, was du um 2 Uhr nachts gebaut hast.",
      switchToLight: "Zum hellen Theme wechseln",
      switchToDark: "Zum dunklen Theme wechseln",
      openLanguages: "Sprache wählen",
      closeLanguages: "Sprachmenü schließen",
      alertErrorTitle: "Anmeldung fehlgeschlagen",
      alertWarningTitle: "Warnung",
      alertSuccessTitle: "Erfolg",
      alertInfoTitle: "Hinweis",
    },
    uk: {
      brandHeadline: "Один логін. Нуль виправдань.",
      brandTagline: "Увійди, щоб керувати тим, що зібрав о другій ночі.",
      switchToLight: "Перемкнути на світлу тему",
      switchToDark: "Перемкнути на темну тему",
      openLanguages: "Обрати мову",
      closeLanguages: "Закрити меню мов",
      alertErrorTitle: "Не вдалося увійти",
      alertWarningTitle: "Попередження",
      alertSuccessTitle: "Готово",
      alertInfoTitle: "Зверни увагу",
    },
    ru: {
      brandHeadline: "Один логин. Ноль оправданий.",
      brandTagline: "Войди, чтобы управлять тем, что собрал в два часа ночи.",
      switchToLight: "Переключить на светлую тему",
      switchToDark: "Переключить на тёмную тему",
      openLanguages: "Выбрать язык",
      closeLanguages: "Закрыть меню языков",
      alertErrorTitle: "Не удалось войти",
      alertWarningTitle: "Предупреждение",
      alertSuccessTitle: "Готово",
      alertInfoTitle: "Обратите внимание",
    },
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
