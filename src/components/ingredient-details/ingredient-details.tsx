import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const { ingredients, status, error } = useSelector((state) => state.ingredients);

  if (status === 'idle' || status === 'loading') {
    return <Preloader />;
  }

  if (status === 'failed') {
    return <p>Не удалось загрузить ингредиенты: {error}</p>;
  }

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <p>Ингредиент не найден.</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
