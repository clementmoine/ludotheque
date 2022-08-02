import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

import Input from 'components/Input';
import Avatar from 'components/Avatar';
import Typography from 'components/Typography';
import NavigationBar from 'components/NavigationBar';

import styles from './Home.module.scss';

const Home: FC = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <div className={styles['home']}>
      <header className={styles['home__header']}>
        <div className={styles['home__header__title']}>
          <Typography variant="body1">Bonjour {user?.firstName}</Typography>
          <Typography variant="title1">Accueil</Typography>
        </div>

        <div className={styles['home__header__actions']}>
          <Avatar size="md" onClick={() => navigate('/profile')} />
        </div>
      </header>

      <Input type="search" placeholder="Rechercher un objet" />

      <main className={styles['home__content']}>
        <section>
          <Typography variant="title3">Vos derniers ajouts</Typography>
        </section>

        <section>
          <Typography variant="title3">Vos collections préférées</Typography>
        </section>
      </main>

      <footer>
        <NavigationBar />
      </footer>
    </div>
  );
};

Home.displayName = 'Home';

export default Home;
