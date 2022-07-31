import { FC } from 'react';

import styles from './Profile.module.scss';

const Profile: FC = () => {
  return (
    <div className={styles['profile']}>
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;
