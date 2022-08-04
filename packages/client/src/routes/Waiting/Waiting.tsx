import { FC } from 'react';

import Spinner from 'components/Spinner';
import Typography from 'components/Typography';

import styles from './Waiting.module.scss';

const Waiting: FC = () => {
  return (
    <div className={styles['waiting']}>
      <header>
        <Typography variant="title1">
          <Spinner />
          &nbsp;Chargement en cours
        </Typography>
      </header>

      <main className={styles['waiting__content']}>
        <Typography variant="body1" element="blockquote" cite="https://www.savoir-inutile.com/">
          L&apos;ornithorynque est un des rares mammifères venimeux. Le mâle porte un aiguillon sur ses pattes
          postérieures qui peut libérer du venin capable d&apos;infliger de vives douleurs à un être humain.
        </Typography>
      </main>
    </div>
  );
};

Waiting.displayName = 'Waiting';

export default Waiting;
