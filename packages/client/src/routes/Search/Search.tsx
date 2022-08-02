import { FC } from 'react';

import Typography from 'components/Typography';

import styles from './Search.module.scss';

const Search: FC = () => {
  return (
    <div className={styles['search']}>
      <Typography variant="title1">Search</Typography>
    </div>
  );
};

Search.displayName = 'Search';

export default Search;
