import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '../utils/burger-api';

import type { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null,
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => getFeedsApi());

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Не удалось загрузить заказы';
      });
  },
});

export default feedSlice.reducer;
