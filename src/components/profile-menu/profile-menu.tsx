import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = (): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch(() => {
        // Ошибка выхода обрабатывается в userSlice.
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
