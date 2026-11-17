import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../../constructorSlice';

import type { TConstructorIngredient, TIngredient } from '@utils-types';

const bunIngredient: TIngredient = {
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

const mainIngredient: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из космогуманоидов',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
};

const sauceIngredient: TIngredient = {
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

const createConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({
  ...ingredient,
  id,
});

describe('constructorSlice', () => {
  it('возвращает initialState при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'unknown/action' });

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('добавляет булку в bun', () => {
    const action = addIngredient(bunIngredient);

    const state = reducer(undefined, action);

    expect(state.bun).toEqual(
      createConstructorIngredient(bunIngredient, action.payload.id)
    );
    expect(state.ingredients).toEqual([]);
  });

  it('добавляет начинку в ingredients', () => {
    const action = addIngredient(mainIngredient);

    const state = reducer(undefined, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(
      createConstructorIngredient(mainIngredient, action.payload.id)
    );
  });

  it('добавляет соус в ingredients', () => {
    const action = addIngredient(sauceIngredient);

    const state = reducer(undefined, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].type).toBe('sauce');
  });

  it('заменяет предыдущую булку новой', () => {
    const firstBun = addIngredient(bunIngredient);
    const firstState = reducer(undefined, firstBun);

    const secondBun = addIngredient({
      ...bunIngredient,
      _id: 'bun-2',
      name: 'Флюоресцентная булка R2-D3',
    });

    const state = reducer(firstState, secondBun);

    expect(state.bun?._id).toBe('bun-2');
    expect(state.ingredients).toEqual([]);
  });

  it('удаляет ингредиент по id', () => {
    const first = addIngredient(mainIngredient);
    const second = addIngredient(sauceIngredient);

    let state = reducer(undefined, first);
    state = reducer(state, second);

    const idToRemove = state.ingredients[0].id;

    state = reducer(state, removeIngredient(idToRemove));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].type).toBe('sauce');
  });

  it('перемещает ингредиент с первой позиции на вторую', () => {
    const first = addIngredient(mainIngredient);
    const second = addIngredient(sauceIngredient);

    let state = reducer(undefined, first);
    state = reducer(state, second);

    state = reducer(state, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients[0].type).toBe('sauce');
    expect(state.ingredients[1].type).toBe('main');
  });

  it('не изменяет порядок при некорректных индексах', () => {
    const first = addIngredient(mainIngredient);
    const second = addIngredient(sauceIngredient);

    let state = reducer(undefined, first);
    state = reducer(state, second);

    const stateAfterInvalidMove = reducer(state, moveIngredient({ from: 0, to: 5 }));

    expect(stateAfterInvalidMove.ingredients).toEqual(state.ingredients);
  });

  it('очищает конструктор', () => {
    const bun = addIngredient(bunIngredient);
    const main = addIngredient(mainIngredient);

    let state = reducer(undefined, bun);
    state = reducer(state, main);

    state = reducer(state, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
