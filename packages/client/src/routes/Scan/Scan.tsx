import { FC, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from 'components/Button';
import Camera, { CameraRef } from 'components/Camera';

import { Code } from 'hooks/useScanner';
import { LocationState } from 'routes';

import styles from './Scan.module.scss';
import Typography from 'components/Typography';
import Icon from 'components/Icon';

const Scan: FC = () => {
  const navigate = useNavigate();

  const camera = useRef<CameraRef>(null);

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

  useEffect(() => {
    return () => {
      camera.current?.stop();
    };
  }, []);

  return (
    <div className={styles['scan']}>
      <Button icon="triangle-left" variant="link" color="white" to={locationState?.from?.pathname || '/'}>
        Retour
      </Button>

      <div className={styles['scan__crosshair']} />

      <main className={styles['scan__advice']}>
        <Icon name="scan" size="40px" color="white" />

        <Typography variant="title2" color="white" align="center">
          Pointez votre appareil sur un code barre.
        </Typography>

        <Button variant="link" color="white">
          Sélectionner à partir d’une photo
        </Button>
      </main>

      <Camera ref={camera} className={styles['scan__video']} onClose={handleClose} onScan={handleScan} />
    </div>
  );
};

Scan.displayName = 'Scan';

export default Scan;
