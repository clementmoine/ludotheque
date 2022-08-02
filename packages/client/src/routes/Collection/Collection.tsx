import { FC } from 'react';

import Typography from 'components/Typography';

import styles from './Collection.module.scss';

const Collection: FC = () => {
  return (
    <div className={styles['collection']}>
      <Typography variant="title1">Collection</Typography>
    </div>
  );
};

Collection.displayName = 'Collection';

export default Collection;
