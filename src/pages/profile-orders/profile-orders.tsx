import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/userSlice';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { orders, ordersStatus, ordersError } = useSelector((state) => state.user);

  useEffect(() => {
    if (ordersStatus === 'idle') {
      void dispatch(fetchUserOrders());
    }
  }, [dispatch, ordersStatus]);

  const handleUpdateOrders = (): void => {
    void dispatch(fetchUserOrders());
  };

  if (ordersStatus === 'idle' || ordersStatus === 'loading') {
    return <Preloader />;
  }

  if (ordersStatus === 'failed') {
    return (
      <div>
        <p>Не удалось загрузить заказы: {ordersError}</p>
        <button type="button" onClick={handleUpdateOrders}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div>
        <p>У вас пока нет заказов.</p>
        <button type="button" onClick={handleUpdateOrders}>
          Обновить
        </button>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
