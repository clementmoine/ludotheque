import classNames from 'classnames';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Typography from 'components/Typography';
import { FC, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LocationState } from 'routes';

import styles from './NavigationBar.module.scss';

export type NavigationBarProps = React.HTMLAttributes<HTMLElement>;

const NavigationBar: FC<NavigationBarProps> = (props) => {
  const location = useLocation();

  const items = useMemo(
    () => ({
      home: {
        icon: ['home-outline', 'home'],
        label: 'Accueil',
        path: '/home',
      },
      search: {
        icon: ['search', 'search-filled'],
        label: 'Rechercher',
        path: '/search',
      },
      collections: {
        icon: ['library-outline', 'library'],
        label: 'Collections',
        path: '/collections',
      },
    }),
    []
  );

  const activeItem = useMemo<keyof typeof items | undefined>(() => {
    // Try to identify the active item from the location pathname
    return (
      (Object.keys(items) as (keyof typeof items)[]).find((key, index) => {
        const item = items[key];

        if (location.pathname === item.path || location.pathname.startsWith(item.path)) {
          return true;
        }

        const nextKeys = (Object.keys(items) as Array<keyof typeof items>).slice(index + 1);

        if (
          !nextKeys.some(
            (nextKey) =>
              location.pathname === items[nextKey].path || location.pathname.startsWith(items[nextKey].path)
          )
        ) {
          return (
            (location.state as LocationState)?.from.pathname === item.path ||
            (location.state as LocationState)?.from.pathname.startsWith(item.path)
          );
        }
      }) || 'home'
    );
  }, [items, location]);

  return (
    <>
      <section className={styles['screen-outlet']}>
        <Outlet />
      </section>

      <nav className={styles['navigation-bar']} {...props}>
        <ul className={styles['navigation-bar__list']}>
          {(Object.keys(items) as Array<keyof typeof items>).map((key) => {
            const item = items[key];

            const isActive = activeItem === key;

            return (
              <li key={key} className={styles['navigation-bar__item']}>
                <Button
                  variant="link"
                  className={classNames(styles['navigation-bar__item__button'], {
                    [styles['navigation-bar__item__button--is-active']]: isActive,
                  })}
                  to={item.path}
                >
                  <Icon className={styles['navigation-bar__icon']} name={item.icon[isActive ? 1 : 0]} />
                  <Typography className={styles['navigation-bar__label']} variant="body2">
                    {item.label}
                  </Typography>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;
