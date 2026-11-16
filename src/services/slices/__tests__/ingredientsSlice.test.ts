import reducer, { fetchIngredients } from '../../ingredientsSlice';

import type { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 40,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
};

describe('ingredientsSlice', () => {
  it('возвращает initialState при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'unknown/action' });

    expect(state).toEqual({
      ingredients: [],
      status: 'idle',
      error: null,
    });
  });

  it('устанавливает loading при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };

    const state = reducer(undefined, action);

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('сохраняет ингредиенты при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [bun, sauce],
    };

    const state = reducer(undefined, action);

    expect(state.status).toBe('succeeded');
    expect(state.ingredients).toEqual([bun, sauce]);
    expect(state.error).toBeNull();
  });

  it('устанавливает failed и ошибку при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' },
    };

    const state = reducer(undefined, action);

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('использует стандартную ошибку, если message отсутствует', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: {},
    };

    const state = reducer(undefined, action);

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
