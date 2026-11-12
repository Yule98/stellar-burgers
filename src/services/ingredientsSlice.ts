import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../utils/burger-api';

import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  status: 'idle',
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => getIngredientsApi(),
  {
    condition: (_, { getState }) => {
      const state = getState() as {
        ingredients: TIngredientsState;
      };

      return state.ingredients.status !== 'loading';
    },
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export default ingredientsSlice.reducer;
