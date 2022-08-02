import Typography from 'components/Typography';
import { FC } from 'react';

import styles from './Landing.module.scss';

const Landing: FC = () => {
  return (
    <div className={styles['landing']}>
      <Typography variant="title1">Landing</Typography>
    </div>
  );
};

Landing.displayName = 'Landing';

export default Landing;
