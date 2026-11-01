import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';
import { selectUser } from '../../services/userSlice';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
