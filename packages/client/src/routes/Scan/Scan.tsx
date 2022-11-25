import { ChangeEvent, FC, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Icon from 'components/Icon';
import Button from 'components/Button';
import Typography from 'components/Typography';
import Camera, { CameraRef } from 'components/Camera';

import { Code } from 'hooks/useScanner';
import useDetector from 'hooks/useDetector';

import { LocationState } from 'routes';

import styles from './Scan.module.scss';

const Scan: FC = () => {
  const navigate = useNavigate();

  const camera = useRef<CameraRef>(null);
  const detector = useDetector();

  const locationState = useLocation().state as LocationState;

  const handleClose = useCallback(() => {
    navigate(locationState?.from?.pathname || '/');
  }, [navigate, locationState]);

  // Handle scan success
  const handleScan = useCallback(
    (codes?: Code[]) => {
      if (!codes) {
        return;
      }

      alert(
        `Vous avez scanné ${codes.length} code${codes.length > 1 ? 's' : ''}\n\n${codes
          .map((code) => code.rawValue)
          .join('\n')}`
      );

      handleClose();
    },
    [handleClose]
  );

  // Import a file to detect bar code in
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event: unknown) => {
      const files = (event as ChangeEvent<HTMLInputElement>).currentTarget?.files;

      if (!files?.length) {
        return;
      }

      detector.detect(files[0]).then((codes) => {
        handleScan(codes as Code[]);
      });
    };

    input.click();
  }, [detector, handleScan]);

  useEffect(() => {
    return () => {
      camera.current?.stop();
    };
  }, []);

  return (
    <div className={styles['scan']}>
      <Button
        icon="triangle-left"
        variant="icon"
        color="white"
        title="Retour à la page précédente"
        to={locationState?.from?.pathname || '/'}
      />

      <div className={styles['scan__crosshair']} />

      <main className={styles['scan__advice']}>
        <Icon name="scan" size="40px" color="white" />

        <Typography variant="title2" color="white" align="center">
          Pointez votre appareil sur un code barre.
        </Typography>

        <Button variant="link" color="white" onClick={handleImport}>
          Sélectionner à partir d’une photo
        </Button>
      </main>

      <Camera ref={camera} className={styles['scan__video']} onClose={handleClose} onScan={handleScan} />
    </div>
  );
};

Scan.displayName = 'Scan';

export default Scan;
