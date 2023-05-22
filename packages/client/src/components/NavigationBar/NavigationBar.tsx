import classNames from 'classnames';
import { FC, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Icon from 'components/Icon';
import Button from 'components/Button';
import Typography from 'components/Typography';

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
      (Object.keys(items) as (keyof typeof items)[]).find(
        (key) => location.pathname === items[key].path || location.pathname.startsWith(items[key].path)
      ) || 'home'
    );
  }, [items, location]);

  return (
    <div className={styles['screen']}>
      {/* Screen */}
      <div className={styles['screen__outlet']}>
        <Outlet />
      </div>

      {/* Navigation bar */}
      <nav className={styles['screen__navigation-bar']} {...props}>
        <ul className={styles['screen__navigation-bar__list']}>
          {(Object.keys(items) as Array<keyof typeof items>).map((key) => {
            const item = items[key];

            const isActive = activeItem === key;

            return (
              <li key={key} className={styles['screen__navigation-bar__item']}>
                <Button
                  variant="link"
                  className={classNames(styles['screen__navigation-bar__item__button'], {
                    [styles['screen__navigation-bar__item__button--is-active']]: isActive,
                  })}
                  to={item.path}
                >
                  <Icon
                    size="24px"
                    className={styles['screen__navigation-bar__icon']}
                    name={item.icon[isActive ? 1 : 0]}
                  />
                  <Typography className={styles['screen__navigation-bar__label']} variant="body2">
                    {item.label}
                  </Typography>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;
