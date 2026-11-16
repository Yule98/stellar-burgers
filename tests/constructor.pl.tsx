import { expect, test, type Page } from '@playwright/test';

import type { TIngredient } from '../src/utils/types';

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

const main: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из космической баранины',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
};

const ingredients = [bun, main, sauce];

const user = {
  email: 'test@example.com',
  name: 'Test User',
};

const createdOrder = {
  order: {
    _id: 'order-1',
    ingredients: [bun._id, main._id, sauce._id, bun._id],
    status: 'done',
    name: 'Космический бургер',
    createdAt: '2026-11-16T12:00:00.000Z',
    updatedAt: '2026-11-16T12:00:00.000Z',
    number: 12345,
  },
  name: 'Test User',
};

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: /\/api\/ingredients/,
  });

  await page.routeFromHAR('tests/hars/token.har', {
    url: /\/api\/auth\/token/,
  });

  await page.routeFromHAR('tests/hars/user.har', {
    url: /\/api\/auth\/user/,
  });

  await page.routeFromHAR('tests/hars/orders.har', {
    url: /\/api\/orders/,
  });

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.goto('/');
});

const closeIngredientModal = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Закрыть' }).click();
};

const addIngredient = async (
  page: Page,
  ingredient: TIngredient
): Promise<void> => {
  const ingredientCard = page
    .locator('li', { hasText: ingredient.name })
    .first();

  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
};

test('add ingredients to constructor works correctly', async ({ page }) => {
  await addIngredient(page, bun);
  await addIngredient(page, main);
  await addIngredient(page, sauce);

  await expect(page.getByText(bun.name).nth(1)).toBeVisible();
  await expect(page.getByText(main.name).nth(1)).toBeVisible();
  await expect(page.getByText(sauce.name).nth(1)).toBeVisible();
});

test('ingredient modal opens and closes by close button', async ({ page }) => {
  await page.getByText(bun.name).first().click();

  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  await page.getByRole('button', { name: 'Закрыть' }).click();

  await expect(page.getByText('Детали ингредиента')).toHaveCount(0);
});

test('ingredient modal closes by overlay click', async ({ page }) => {
  await page.getByText(bun.name).first().click();

  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  await page
    .locator('[class*="modal-overlay__overlay"]')
    .click({ position: { x: 10, y: 10 } });

  await expect(page.getByText('Детали ингредиента')).toHaveCount(0);
});

test('user can create an order', async ({ page }) => {
  await addIngredient(page, bun);
  await addIngredient(page, main);
  await addIngredient(page, sauce);

  await page.getByRole('button', { name: /оформить заказ/i }).click();

  await expect(page.getByText('12345')).toBeVisible();

  await page.getByRole('button', { name: 'Закрыть' }).click();

  await expect(page.getByText('12345')).toHaveCount(0);
  await expect(page.getByText('Выберите булки').first()).toBeVisible();
});