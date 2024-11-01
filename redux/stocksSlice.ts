import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchStocks, nextBatch} from '../services/api';
import {Stock} from '../interfaces/Stock';

interface StockState {
  stocks: Stock[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  next_url: string | null;
}

const initialState: StockState = {
  stocks: [],
  status: 'idle',
  error: null,
  next_url: null,
};

export const loadStocks = createAsyncThunk(
  'stocks/fetch',
  async (query: string = '') => {
    const data = await fetchStocks(query);
    return data;
  },
);

export const loadNextStocks = createAsyncThunk(
    'stocks/nextFetch',
    async (next_url: string = '') => {
      console.log('here')
      console.log(next_url)
      const data = await nextBatch(next_url);
      console.log(data)
      return data;
    },
  );

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadStocks.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadStocks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.stocks = action.payload.data;
        state.next_url = action.payload.next_url;
      })
      .addCase(loadStocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch stocks';
        state.next_url = null;
      })
      .addCase(loadNextStocks.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadNextStocks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.stocks = [...state.stocks,...action.payload.data];
        state.next_url = action.payload.next_url;
      })
      .addCase(loadNextStocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch next stocks';
        state.next_url = null;
      });
  },
});

export default stocksSlice.reducer;
