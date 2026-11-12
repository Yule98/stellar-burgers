import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
  onIngredientClick,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();

  const handleAdd = (): void => {
    console.log('Клик по добавить', ingredient.name);
    onIngredientClick(ingredient);
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
