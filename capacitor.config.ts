import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wasafimedia.premium',
  appName: 'Wasafi Premium',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
    backgroundColor: '#0d0d0d',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0d0d0d',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0d0d0d',
      iosSpinnerStyle: 'small',
      spinnerColor: '#E11D48',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
