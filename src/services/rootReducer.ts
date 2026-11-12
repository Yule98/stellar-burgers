import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './constructorSlice';
import feedReducer from './feedSlice';
import ingredientsReducer from './ingredientsSlice';
import orderReducer from './orderSlice';
import userReducer from './userSlice';

export const rootReducer = combineReducers({
  feed: feedReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
});
