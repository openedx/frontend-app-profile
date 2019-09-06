import App, { APP_READY } from './App';

export default function validateConfig(...keys) {
  App.subscribe(APP_READY, () => {
    keys.forEach((key) => {
      if (App.config[key] === undefined) {
        throw new Error(`Configuration error: ${key} is required.`);
      }
    });
  });
}
