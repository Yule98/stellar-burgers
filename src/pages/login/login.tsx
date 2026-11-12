import { LoginUI } from '@ui-pages';
import { type FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser, selectUserError } from '../../services/userSlice';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const errorText = useSelector(selectUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    void dispatch(
      loginUser({
        email,
        password,
      })
    )
      .unwrap()
      .then(() => {
        void navigate(from, { replace: true });
      })
      .catch(() => {
        // Здесь не выполняем переход: форма отображает errorText из userSlice.
      });
  };
  return (
    <LoginUI
      errorText={errorText ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
