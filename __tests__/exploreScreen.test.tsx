/* global __DEV__ */

import React, {act} from 'react';
import ExploreScreen from '../screens/ExploreScreen'; 
import {renderWithProviders} from '../utils/test-utils';
import {fetchStocks} from '../services/api';
import {loadStocks} from '../redux/stocksSlice';
jest.mock('../services/api');

describe('ExploreScreen', () => {
  it('should render the search input', () => {
    (fetchStocks as jest.Mock).mockResolvedValue({
      next_ur: null,
      data: [],
    });
    const {getByPlaceholderText} = renderWithProviders(<ExploreScreen />, {
      preloadedState: {
        stocks: {
          stocks: [],
          status: 'idle',
          error: null,
          next_url:null
        },
      },
    });
    const searchInput = getByPlaceholderText('Search for stocks');
    expect(searchInput).toBeTruthy();
  });

  it('should show loading indicator while fetching stocks', () => {
    const {getByLabelText} = renderWithProviders(<ExploreScreen />, {
      preloadedState: {
        stocks: {
          stocks: [],
          status: 'loading',
          error: null,
          next_url:null
        },
      },
    });
    const loadingIndicator = getByLabelText('loading');
    // (fetchStocks as jest.Mock).mockResolvedValue({
    //   next_ur: null,
    //   data: [],
    // });
    expect(loadingIndicator).toBeTruthy();
  });

  it('should show stock item', async () => {
    (fetchStocks as jest.Mock).mockResolvedValue({
      next_ur: null,
      data: [{ticker: 'AAPL', name: 'Apple', composite_figi: '1'}],
    });
    const {getByLabelText, store} = renderWithProviders(<ExploreScreen />, {
      preloadedState: {
        stocks: {
          stocks: [],
          status: 'idle',
          error: null,
          next_url:null
        },
      },
    });
    await act(async () => {
      await store.dispatch(loadStocks(''));
    });
    const tickerName = getByLabelText('stockItemTicker');
    expect(tickerName).toBeTruthy();
  });

  it('should show error message on fetch error', async () => {
    (fetchStocks as jest.Mock).mockRejectedValue(new Error('failed'));
    const {getByLabelText, store} = renderWithProviders(<ExploreScreen />, {
      preloadedState: {
        stocks: {
          stocks: [],
          status: 'idle',
          error: null,
          next_url:null
        },
      },
    });
    await act(async () => {
      await store.dispatch(loadStocks(''));
    });
    const errorMessage = getByLabelText('errorMessage');
    expect(errorMessage).toBeTruthy();
  });

});
