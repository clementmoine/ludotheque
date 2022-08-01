import { FC } from 'react';

import styles from './NavigationBar.module.scss';

export type NavigationBarProps = React.HTMLAttributes<HTMLElement>;

const NavigationBar: FC<NavigationBarProps> = (props) => {
  return <nav className={styles['navigation-bar']} {...props} />;
};

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;
