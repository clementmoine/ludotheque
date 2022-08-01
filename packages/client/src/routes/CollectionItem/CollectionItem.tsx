import { FC } from 'react';

import styles from './CollectionItem.module.scss';

const CollectionItem: FC = () => {
  return (
    <div className={styles['collection-item']}>
      <h1>Collection item</h1>
    </div>
  );
};

CollectionItem.displayName = 'CollectionItem';

export default CollectionItem;
