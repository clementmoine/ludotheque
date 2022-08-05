import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';

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
const Collection = lazy(() => import('routes/Collection'));
const Collections = lazy(() => import('routes/Collections'));
const CollectionItem = lazy(() => import('routes/CollectionItem'));

export interface LocationState {
  from: Location;
}

export interface RequireAuthProps {
  children?: JSX.Element;
  withNavigationBar?: boolean;
}

function RequireAuth({ children, withNavigationBar }: RequireAuthProps) {
  const location = useLocation();

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner size="xs" label="Chargement" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {children}
      {withNavigationBar ? <NavigationBar /> : <Outlet />}
    </>
  );
}

const Router: FC = () => {
  return (
    <Suspense fallback={<Spinner size="xs" label="Chargement" />}>
      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/landing" element={<Landing />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Routes without navigation bar */}
          <Route path="/" element={<RequireAuth />}>
            {/* Scan */}
            <Route
              path="/scan"
              element={
                <RequireAuth>
                  <Scan />
                </RequireAuth>
              }
            />
          </Route>

          {/* Routes with navigation bar */}
          <Route path="/" element={<RequireAuth withNavigationBar />}>
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

              {/* Collection detail */}
              <Route path=":name">
                <Route index element={<Collection />} />

                {/* Edit collection */}
                <Route path="edit" element={<Collection />} />

                {/* Collection item */}
                <Route path=":id">
                  <Route index element={<CollectionItem />} />

                  {/* Edit collection item */}
                  <Route path="edit" element={<CollectionItem />} />
                </Route>
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
