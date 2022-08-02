import { FC } from 'react';

import useAuth from 'hooks/useAuth';

import Typography from 'components/Typography';

import styles from './Profile.module.scss';

const Profile: FC = () => {
  const { logout } = useAuth();

  return (
    <div className={styles['profile']}>
      <Typography variant="title1">Profile</Typography>

      <button onClick={() => logout()}>Se déconnecter</button>
    </div>
  );
};

Profile.displayName = 'Profile';

export default Profile;
