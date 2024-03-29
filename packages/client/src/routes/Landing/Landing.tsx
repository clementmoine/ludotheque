import { FC } from 'react';

import IconSlider from './IconSlider';

import Button from 'components/Button';
import Typography from 'components/Typography';

import styles from './Landing.module.scss';

const Landing: FC = () => {
  return (
    <div className={styles['landing']}>
      <IconSlider />

      <main className={styles['landing__content']}>
        <Typography variant="title1">Collectionnez facilement ! 👀</Typography>
        <Typography>Stockez, identifiez et suivez vos collections.</Typography>

        <Button to="/login" className={styles['landing__button']}>
          Commencer
        </Button>
      </main>
    </div>
  );
};

Landing.displayName = 'Landing';

export default Landing;
