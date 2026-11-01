import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  loginUserApi,
  getUserApi,
  refreshToken,
  registerUserApi,
  getOrdersApi,
  updateUserApi,
  logoutApi,
} from '../utils/burger-api';

import type { TOrder, TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  request: boolean;
  error: string | null;
  orders: TOrder[];
  ordersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  ordersError: string | null;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  request: false,
  error: null,
  orders: [],
  ordersStatus: 'idle',
  ordersError: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const data = await loginUserApi({ email, password });

    localStorage.setItem('refreshToken', data.refreshToken);
    document.cookie = `accessToken=${data.accessToken}`;

    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const data = await registerUserApi({ name, email, password });

    localStorage.setItem('refreshToken', data.refreshToken);
    document.cookie = `accessToken=${data.accessToken}`;

    return data.user;
  }
);

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  if (!localStorage.getItem('refreshToken')) {
    return Promise.reject(new Error('Нет refresh-токена'));
  }

  await refreshToken();
  const data = await getUserApi();

  return data.user;
});

export const fetchUserOrders = createAsyncThunk(
  'user/fetchUserOrders',
  async () => await getOrdersApi()
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: { name?: string; email?: string; password?: string }) => {
    const data = await updateUserApi(user);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  document.cookie = 'accessToken=; Max-Age=0';
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.request = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message ?? 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.request = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.ordersStatus = 'loading';
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.ordersStatus = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.ordersStatus = 'failed';
        state.ordersError = action.error.message ?? 'Не удалось загрузить заказы';
      })
      .addCase(updateUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.request = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message ?? 'Не удалось обновить данные';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const selectUser = (state: { user: TUserState }): TUser | null => state.user.user;

export const selectIsAuthChecked = (state: { user: TUserState }): boolean =>
  state.user.isAuthChecked;

export const selectUserRequest = (state: { user: TUserState }): boolean =>
  state.user.request;

export const selectUserError = (state: { user: TUserState }): string | null =>
  state.user.error;

export const selectUserOrders = (state: { user: TUserState }): TOrder[] =>
  state.user.orders;

export default userSlice.reducer;
