import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { fetchIngredients } from '../../services/ingredientsSlice';
import { fetchOrderByNumber } from '../../services/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderNumber = Number(number);

  const isValidNumber =
    /^\d+$/.test(number ?? '') && Number.isSafeInteger(orderNumber) && orderNumber > 0;

  const {
    viewedOrder: orderData,
    viewedOrderStatus: orderStatus,
    viewedOrderError: orderError,
  } = useSelector((state) => state.order);

  const {
    ingredients,
    status: ingredientsStatus,
    error: ingredientsError,
  } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (isValidNumber) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, isValidNumber]);

  const orderInfo = useMemo(() => {
    if (orderData?.number !== orderNumber || !ingredients.length) {
      return null;
    }

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, id: string) => {
        if (acc[id]) {
          acc[id].count += 1;
        } else {
          const ingredient = ingredients.find((item) => item._id === id);

          if (ingredient) {
            acc[id] = {
              ...ingredient,
              count: 1,
            };
          }
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date: new Date(orderData.createdAt),
      total,
    };
  }, [orderData, orderNumber, ingredients]);

  const handleRetry = (): void => {
    if (isValidNumber) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }

    if (ingredientsStatus === 'failed') {
      void dispatch(fetchIngredients());
    }
  };

  if (!isValidNumber) {
    return <p>Некорректный номер заказа.</p>;
  }

  if (orderStatus === 'failed' || ingredientsStatus === 'failed') {
    return (
      <div>
        <p>Не удалось загрузить данные: {orderError ?? ingredientsError}</p>
        <button type="button" onClick={handleRetry}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (
    orderStatus === 'idle' ||
    orderStatus === 'loading' ||
    ingredientsStatus === 'idle' ||
    ingredientsStatus === 'loading'
  ) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <p>Не удалось подготовить данные заказа.</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
