import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lumina.learn',
  appName: 'Lumina',
  // Vite builds the web app into `dist`; Capacitor copies this into the
  // native project on `cap sync`.
  webDir: 'dist',
  backgroundColor: '#070d18',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#070d18',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      // Light text on the dark app background.
      style: 'DARK',
      backgroundColor: '#070d18',
      overlaysWebView: false,
    },
  },
};

export default config;
