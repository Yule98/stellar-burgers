import { RegisterUI } from '@ui-pages';
import { type FormEvent, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { registerUser, selectUserError } from '../../services/userSlice';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const errorText = useSelector(selectUserError);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    if (!userName || !email || !password) {
      return;
    }

    dispatch(
      registerUser({
        name: userName,
        email,
        password,
      })
    )
      .unwrap()
      .catch(() => {
        // Здесь оставляем форму открытой: она отображает errorText из userSlice.
      });
  };

  return (
    <RegisterUI
      errorText={errorText ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
