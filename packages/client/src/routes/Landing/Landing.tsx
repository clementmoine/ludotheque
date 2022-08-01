import { FC } from 'react';

import styles from './Landing.module.scss';

const Landing: FC = () => {
  return (
    <div className={styles['landing']}>
      <h1>Landing</h1>
    </div>
  );
};

Landing.displayName = 'Landing';

export default Landing;
