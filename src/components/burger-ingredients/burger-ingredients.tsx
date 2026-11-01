import { BurgerIngredientsUI, Preloader } from '@ui';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { addIngredient } from '../../services/constructorSlice';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient, TTabMode } from '@utils-types';

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { ingredients, status, error } = useSelector((state) => state.ingredients);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0,
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0,
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string): void => {
    setCurrentTab(tab as TTabMode);

    if (tab === 'bun') {
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (tab === 'main') {
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (tab === 'sauce') {
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onIngredientClick = (ingredient: TIngredient): void => {
    dispatch(addIngredient(ingredient));
  };

  const buns = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'bun'),
    [ingredients]
  );

  const mains = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'main'),
    [ingredients]
  );

  const sauces = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'sauce'),
    [ingredients]
  );

  if (status === 'idle' || status === 'loading') {
    return <Preloader />;
  }

  if (status === 'failed') {
    return (
      <div>
        <p>Не удалось загрузить ингредиенты: {error}</p>
        <button
          type="button"
          onClick={() => {
            void dispatch(fetchIngredients());
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!ingredients.length) {
    return <p>Список ингредиентов пуст.</p>;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      onIngredientClick={onIngredientClick}
    />
  );
};
