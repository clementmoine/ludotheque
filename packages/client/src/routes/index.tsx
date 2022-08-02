import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

import NavigationBar from 'components/NavigationBar';

const Home = lazy(() => import('./Home'));
const Login = lazy(() => import('./Login'));
const Search = lazy(() => import('./Search'));
const Landing = lazy(() => import('./Landing'));
const Profile = lazy(() => import('./Profile'));
const Collection = lazy(() => import('./Collection'));
const Collections = lazy(() => import('./Collections'));
const CollectionItem = lazy(() => import('./CollectionItem'));

export interface LocationState {
  from: Location;
}

function RequireAuth({ children }: { children?: JSX.Element }) {
  const location = useLocation();

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || null;
}

const Router: FC = () => {
  return (
    <Suspense fallback="Loading ...">
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
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

Router.displayName = 'Router';

export default Router;
