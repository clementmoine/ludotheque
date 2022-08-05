import { FC, useCallback } from 'react';

import styles from './Scan.module.scss';
import Camera from 'components/Camera';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocationState } from 'routes';
import { Code } from 'hooks/useScanner';

const Scan: FC = () => {
  const navigate = useNavigate();

  const locationState = useLocation().state as LocationState;

  const handleClose = useCallback(() => {
    navigate(locationState?.from?.pathname || '/');
  }, [navigate, locationState]);

  const handleScan = useCallback(
    (codes: Code[]) => {
      alert(
        `Vous avez scanné ${codes.length} code${codes.length > 1 ? 's' : ''}\n\n${codes
          .map((code) => code.rawValue)
          .join('\n')}`
      );

      handleClose();
    },
    [handleClose]
  );

  return (
    <div className={styles['scan']}>
      <div className={styles['scan__crosshair']}></div>

      <Camera className={styles['scan__video']} onClose={handleClose} onScan={handleScan} />
    </div>
  );
};

Scan.displayName = 'Scan';

export default Scan;
