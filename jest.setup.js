// Setup for react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Mock for react-native-reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

// Mock for react-native-svg
jest.mock('react-native-svg', () => ({
  SvgUri: jest.fn(() => 'SvgUri'),
  SvgXml: jest.fn(() => 'SvgXml'),
}));

// Mock StyleSheet API
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => {
  return {
    create: jest.fn(styles => styles), // Return styles as is for testing
    flatten: jest.fn(styles => styles), // Return flattened styles
    compose: jest.fn(styles => styles),
    sheet: {
      // Allow usage of the sheet API if needed
      _getSheet: jest.fn(),
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  const FlatList = require('react-native/Libraries/Lists/FlatList');
  return {
    ActivityIndicator: View,
    TouchableOpacity: View,
    Text: View,
    TextInput: View,
    FlatList: FlatList,
  };
});
