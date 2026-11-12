import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { ConstructorPage } from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Feed } from '@pages/feed';
import { ForgotPassword } from '@pages/forgot-password';
import { Login } from '@pages/login';
import { NotFound404 } from '@pages/not-fount-404';
import { Profile } from '@pages/profile';
import { ProfileOrders } from '@pages/profile-orders';
import { Register } from '@pages/register';
import { ResetPassword } from '@pages/reset-password';

import { fetchIngredients } from '../../services/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  checkUserAuth,
  selectIsAuthChecked,
  selectUser,
} from '../../services/userSlice';

import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from =
      (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredientsStatus = useSelector((state) => state.ingredients.status);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    if (ingredientsStatus === 'idle') {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientsStatus]);

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <RouteComponent />
    </div>
  );
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as {
    background?: Location;
  } | null;

  const background = locationState?.background;

  const handleModalClose = (): void => {
    void navigate(-1);
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/ingredients/:id"
          element={
            <main className="pt-10">
              <h1 className="text text_type_main-large">Детали ингредиента</h1>
              <IngredientDetails />
            </main>
          }
        />

        <Route
          path="/feed/:number"
          element={
            <main className="pt-10">
              <OrderInfo />
            </main>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <main className="pt-10">
                <OrderInfo />
              </main>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="Информация о заказе" onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
export default App;
