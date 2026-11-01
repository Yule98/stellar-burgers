import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { clearConstructor } from '../../services/constructorSlice';
import { fetchNewOrder, clearOrder } from '../../services/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser, fetchUserOrders } from '../../services/userSlice';

import type { RootState } from '../../services/store';
import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const { order, orderRequest } = useSelector((state: RootState) => state.order);

  const constructorItems = {
    bun,
    ingredients,
  };

  const orderModalData = order;

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!user) {
      void navigate('/login', {
        state: { from: location },
      });

      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(fetchNewOrder(ingredientIds))
      .unwrap()
      .then(() => {
        void dispatch(fetchUserOrders());
      })
      .catch(() => {
        // Ошибка оформления заказа обрабатывается в orderSlice.
      });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
