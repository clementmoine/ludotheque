import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

import Spinner from 'components/Spinner';
import Typography from 'components/Typography';
import NavigationBar from 'components/NavigationBar';

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

function RequireAuth({ children }: { children?: JSX.Element }) {
  const location = useLocation();

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner size="xs" label="Chargement" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || null;
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

          {/* Private routes */}
          <Route
            path="/"
            element={
              <>
                <RequireAuth />
                <NavigationBar />
              </>
            }
          >
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
