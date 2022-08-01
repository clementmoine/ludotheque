import useAuth from 'hooks/useAuth';
import { FC } from 'react';

import Avatar from 'components/Avatar';

import styles from './Home.module.scss';
import { useNavigate } from 'react-router-dom';

const Home: FC = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <div className={styles['home']}>
      <header>
        <div>
          <p>Bonjour {user?.firstName}</p>
          <h1>Accueil</h1>
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
