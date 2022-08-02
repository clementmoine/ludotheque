import { FC } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './NavigationBar.module.scss';

export type NavigationBarProps = React.HTMLAttributes<HTMLElement>;

const NavigationBar: FC<NavigationBarProps> = (props) => {
  return (
    <>
      <Outlet />

      <nav className={styles['navigation-bar']} {...props}>
        <ul className={styles['navigation-bar__list']}>
          <li className={styles['navigation-bar__item']}>
            <NavLink to="/">
              <span className={styles['navigation-bar__item-text']}>Accueil</span>
            </NavLink>
          </li>

          <li className={styles['navigation-bar__item']}>
            <NavLink to="/search">
              <span className={styles['navigation-bar__item-text']}>Recherche</span>
            </NavLink>
          </li>

          <li className={styles['navigation-bar__item']}>
            <NavLink to="/collections">
              <span className={styles['navigation-bar__item-text']}>Collections</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;
