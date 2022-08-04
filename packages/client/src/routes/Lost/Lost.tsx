import { FC } from 'react';
import { useLocation } from 'react-router-dom';

import Typography from 'components/Typography';
import Button from 'components/Button';

import { LocationState } from 'routes';

import styles from './Lost.module.scss';

const Lost: FC = () => {
  const locationState = useLocation().state as LocationState;

  return (
    <div className={styles['lost']}>
      <header>
        <Typography variant="title1">Vous êtes bien loin de la ville !</Typography>
      </header>

      <main className={styles['lost__content']}>
        <Typography variant="body1" element="blockquote" cite="Le développeur">
          Mais ... Qu&apos;est-ce que vous faites là ? Qu&apos;est-ce qui a bien pu vous conduire ici ? Bon
          ... Peu importe, marchez un peu sur vos pas et vous retrouverez la civilisation vous en faites pas !
        </Typography>

        <Button to={locationState?.from?.pathname || '/'} navigateOptions={{ replace: true }}>
          Retourner à la civilisation
        </Button>
      </main>
    </div>
  );
};

Lost.displayName = 'Lost';

export default Lost;
