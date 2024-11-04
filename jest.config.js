// module.exports = {
//   preset: 'react-native',
// };

// jest.config.js
module.exports = {
  preset: 'react-native',
  // preset: 'ts-jest',
  setupFiles: ['./jest.setup.js', './__mocks__/Dimensions.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest to transform files
  },
  setupFilesAfterEnv: [
    // '@testing-library/jest-native/extend-expect',
    './jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|@react-navigation)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
    'android.js',
    'ios.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],

  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
    '^react-native/Libraries/Utilities/Platform$':
      'react-native/Libraries/Utilities/Platform.android',
       "^react-native$": "<rootDir>/node_modules/react-native"
  },
  
  globals: {
    __DEV__: true,
  },
  testEnvironment: 'node',
};
