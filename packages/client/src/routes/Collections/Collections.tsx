import { FC } from 'react';

import Typography from 'components/Typography';

import styles from './Collections.module.scss';

const Collections: FC = () => {
  return (
    <div className={styles['collections']}>
      <Typography variant="title1">Collections</Typography>
    </div>
  );
};

Collections.displayName = 'Collections';

export default Collections;
