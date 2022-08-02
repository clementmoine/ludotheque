import useAuth from 'hooks/useAuth';
import { FC } from 'react';

import Avatar from 'components/Avatar';

import { useNavigate } from 'react-router-dom';

import Typography from 'components/Typography';

import styles from './Home.module.scss';

const Home: FC = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <div className={styles['home']}>
      <header>
        <div>
          <Typography variant="body1">Bonjour {user?.firstName}</Typography>
          <Typography variant="title1">Accueil</Typography>
        </div>

        <div>
          <Avatar size="md" onClick={() => navigate('/profile')} />
        </div>
      </header>
    </div>
  );
};

Home.displayName = 'Home';

export default Home;
