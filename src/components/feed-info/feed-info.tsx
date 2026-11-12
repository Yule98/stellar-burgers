import { FeedInfoUI } from '@ui';

import { useSelector } from '../../services/store';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const { orders, total, totalToday, status, error } = useSelector(
    (state) => state.feed
  );

  const feed = {
    orders,
    total,
    totalToday,
    isLoading: status === 'loading',
    error,
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
