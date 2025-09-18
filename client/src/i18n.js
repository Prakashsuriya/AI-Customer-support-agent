import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "login": {
        "welcome": "Welcome Back",
        "subtitle": "Sign in to your account",
        "loggingIn": "Logging in...",
        "email": "Email",
        "password": "Password",
        "login": "Login"
      },
      "app": {
        "name": "AI Customer Support"
      },
      "actions": {
        "darkMode": "Dark Mode",
        "help": "Help",
        "logout": "Logout"
      },
      "chat": {
        "getStarted": "Get Started",
        "pressEnter": "Press Enter to send"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
