import { FC } from 'react';

import styles from './Home.module.scss';

const Home: FC = () => {
  return (
    <div className={styles['home']}>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
