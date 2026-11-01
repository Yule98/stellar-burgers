import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchFeeds } from '../../services/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { orders, status, error } = useSelector((state) => state.feed);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchFeeds());
    }
  }, [dispatch, status]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  if (status === 'idle' || status === 'loading') {
    return <Preloader />;
  }

  if (status === 'failed') {
    return (
      <div>
        <p>Не удалось загрузить ленту: {error}</p>
        <button type="button" onClick={handleGetFeeds}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div>
        <p>В ленте пока нет заказов.</p>
        <button type="button" onClick={handleGetFeeds}>
          Обновить
        </button>
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
