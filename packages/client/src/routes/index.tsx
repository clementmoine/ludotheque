import useAuth from 'hooks/useAuth';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./Home'));
const Login = lazy(() => import('./Login'));

const Router = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback="Loading ...">
      <BrowserRouter>
        {!user ? ( // If the user is not logged in
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        ) : (
          // If the user is logged in
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        )}
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
