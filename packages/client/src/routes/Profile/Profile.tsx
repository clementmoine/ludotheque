import useAuth from 'hooks/useAuth';
import { FC } from 'react';

import styles from './Profile.module.scss';

const Profile: FC = () => {
  const { logout } = useAuth();

  return (
    <div className={styles['profile']}>
      <h1>Profile</h1>

      <button onClick={() => logout()}>Se déconnecter</button>
    </div>
  );
};

Profile.displayName = 'Profile';

export default Profile;
