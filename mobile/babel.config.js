module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // React Native Reanimation
    'react-native-reanimated/plugin',
    // React Native Module Alias
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': ['./src'],
          '@assets': ['./assets'],
        },
      },
    ],
  ],
};
