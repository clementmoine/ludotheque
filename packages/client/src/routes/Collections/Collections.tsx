import { FC } from 'react';

import styles from './Collections.module.scss';

const Collections: FC = () => {
  return (
    <div className={styles['collections']}>
      <h1>Collections</h1>
    </div>
  );
};

Collections.displayName = 'Collections';

export default Collections;
