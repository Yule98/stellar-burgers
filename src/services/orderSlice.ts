import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';

import type { TOrder } from '@utils-types';

type TOrderState = {
  order: TOrder | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  orderRequest: boolean;
  viewedOrder: TOrder | null;
  viewedOrderStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  viewedOrderError: string | null;
  currentRequestId: string | null;
};

const initialState: TOrderState = {
  order: null,
  status: 'idle',
  error: null,
  orderRequest: false,
  viewedOrder: null,
  viewedOrderStatus: 'idle',
  viewedOrderError: null,
  currentRequestId: null,
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    if (!response.success) {
      throw new Error('Не удалось получить заказ');
    }

    const order = response.orders.find((item) => item.number === number);

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

export const fetchNewOrder = createAsyncThunk(
  'order/fetchNewOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);

    if (!response.success) {
      throw new Error('Не удалось оформить заказ');
    }

    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.status = 'idle';
      state.error = null;
      state.orderRequest = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state, action) => {
        state.viewedOrderStatus = 'loading';
        state.viewedOrder = null;
        state.viewedOrderError = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.viewedOrderStatus = 'succeeded';
        state.viewedOrder = action.payload;
        state.currentRequestId = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.viewedOrderStatus = 'failed';
        state.viewedOrderError = action.error.message ?? 'Не удалось загрузить заказ';
        state.currentRequestId = null;
      })
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
        state.status = 'loading';
        state.order = null;
        state.error = null;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(fetchNewOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
