import { FC, lazy, Suspense, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { NavigateOptions as _NavigateOptions } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

import Spinner from 'components/Spinner';
import NavigationBar from 'components/NavigationBar';

const Scan = lazy(() => import('routes/Scan'));
const Lost = lazy(() => import('routes/Lost'));
const Home = lazy(() => import('routes/Home'));
const Login = lazy(() => import('routes/Login'));
const Search = lazy(() => import('routes/Search'));
const Landing = lazy(() => import('routes/Landing'));
const Profile = lazy(() => import('routes/Profile'));
const Register = lazy(() => import('routes/Register'));
const Forgotten = lazy(() => import('routes/Forgotten'));
const Collection = lazy(() => import('routes/Collection'));
const Collections = lazy(() => import('routes/Collections'));
const CollectionItem = lazy(() => import('routes/CollectionItem'));

export interface LocationState {
  from?: Location;
  previousData?: Record<string, any>;
}

export interface NavigateOptions extends _NavigateOptions {
  state?: LocationState;
}

function UnAuthenticatedOnly() {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/home', { replace: true });
  }, [user, navigate]);

  return <Outlet />;
}

function AuthenticatedOnly() {
  const navigate = useNavigate();

  const location = useLocation();

  const { user, isLoading } = useAuth();

  const showNavigationBar = useMemo(() => !['/scan'].includes(location.pathname), [location.pathname]);

  useEffect(() => {
    if (!isLoading && !user) navigate('/login', { replace: true, state: { from: location } });
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return <Spinner size="xs" label="Chargement" />;
  }

  return showNavigationBar ? <NavigationBar /> : <Outlet />;
}

const Router: FC = () => {
  return (
    <Suspense fallback={<Spinner size="xs" label="Chargement" />}>
      <BrowserRouter>
        <Routes>
          {/* Unauthenticated routes */}
          <Route path="" element={<UnAuthenticatedOnly />}>
            {/* Landing */}
            <Route path="/landing" element={<Landing />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Register */}
            <Route path="/register" element={<Register />} />

            {/* Forgotten */}
            <Route path="/forgotten" element={<Forgotten />} />
          </Route>

          {/* Authenticated routes */}
          <Route path="/" element={<AuthenticatedOnly />}>
            {/* Scan */}
            <Route path="/scan" element={<Scan />} />

            {/* Home */}
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Search */}
            <Route path="/search" element={<Search />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Collections */}
            <Route path="/collections">
              <Route index element={<Collections />} />

              {/* New collection */}
              <Route path="new" element={<Collection />} />

              {/* Edit collection */}
              <Route path="edit" element={<Collection />} />

              {/* New collection item */}
              <Route path="new" element={<CollectionItem />} />

              {/* Collection item */}
              <Route path=":collectionId/items/:itemId">
                <Route index element={<CollectionItem />} />

                {/* Edit collection item */}
                <Route path="edit" element={<CollectionItem />} />
              </Route>

              {/* Collection detail */}
              <Route path=":id">
                <Route index element={<Collection />} />
              </Route>
            </Route>
          </Route>

          {/* Lost */}
          <Route path="*" element={<Lost />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

Router.displayName = 'Router';

export default Router;
