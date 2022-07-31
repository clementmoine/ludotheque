import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

const Home = lazy(() => import('./Home'));
const Item = lazy(() => import('./Item'));
const Login = lazy(() => import('./Login'));
const Search = lazy(() => import('./Search'));
const Landing = lazy(() => import('./Landing'));
const Profile = lazy(() => import('./Profile'));
const Collection = lazy(() => import('./Collection'));
const Collections = lazy(() => import('./Collections'));

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

const Router = () => {
  return (
    <Suspense fallback="Loading ...">
      <BrowserRouter>
        <Routes>
          {/* Root */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Landing */}
          <Route path="/landing" element={<Landing />} />

          {/* Home */}
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          {/* Search */}
          <Route
            path="/search"
            element={
              <RequireAuth>
                <Search />
              </RequireAuth>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* Collections */}
          <Route path="/collections">
            <Route
              index
              element={
                <RequireAuth>
                  <Collections />
                </RequireAuth>
              }
            />

            {/* New collection */}
            <Route
              path="new"
              element={
                <RequireAuth>
                  <Collection />
                </RequireAuth>
              }
            />

            {/* Collection detail */}
            <Route path=":name">
              <Route
                index
                element={
                  <RequireAuth>
                    <Collection />
                  </RequireAuth>
                }
              />

              {/* Edit collection */}
              <Route
                path="edit"
                element={
                  <RequireAuth>
                    <Collection />
                  </RequireAuth>
                }
              />

              {/* Collection item */}
              <Route path=":id">
                <Route
                  index
                  element={
                    <RequireAuth>
                      <Item />
                    </RequireAuth>
                  }
                />

                {/* Edit collection item */}
                <Route
                  path="edit"
                  element={
                    <RequireAuth>
                      <Item />
                    </RequireAuth>
                  }
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
