import { FC } from 'react';

import Typography from 'components/Typography';

import styles from './CollectionItem.module.scss';

const CollectionItem: FC = () => {
  return (
    <div className={styles['collection-item']}>
      <Typography variant="title1">Collection item</Typography>
    </div>
  );
};

CollectionItem.displayName = 'CollectionItem';

export default CollectionItem;
