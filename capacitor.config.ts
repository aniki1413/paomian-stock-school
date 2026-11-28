import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Native shell for the static client build (`npm run build:native` → dist/client).
 * No remote server URL: the game is bundled in the app, and the hosted site
 * keeps using `npm run build`.
 */
const config: CapacitorConfig = {
  appId: "com.aniki1413.paomianstock",
  appName: "泡麵家親子股海",
  webDir: "dist/client",
  backgroundColor: "#f6d2ae",
  zoomEnabled: false,
  android: {
    backgroundColor: "#f6d2ae",
  },
  ios: {
    backgroundColor: "#f6d2ae",
    contentInset: "automatic",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#f6d2ae",
      showSpinner: false,
      launchShowDuration: 800,
    },
  },
};

export default config;
