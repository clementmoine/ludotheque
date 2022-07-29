import { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';

import type { FC } from 'react';

import styles from './CameraModal.module.scss';

import { Code } from 'hooks/useScanner';

import Camera, { CameraRef } from 'components/Camera';

export interface CameraProps {
  visible: boolean;
  className?: string;
  onClose: () => void;
}

const CameraModal: FC<CameraProps> = (props) => {
  const { className, visible, onClose } = props;

  const camera = useRef<CameraRef>(null);

  const handleScan = useCallback((codes: Code[]) => {
    alert('Nouvel objet pour votre collection');
  }, []);

  useEffect(() => {
    if (!camera.current) {
      return;
    }

    if (visible) {
      camera.current.start();
    } else {
      camera.current.stop();
    }
  }, [visible]);

  return (
    <div
      className={classNames([
        className,
        styles['camera-modal'],
        { [styles['camera-modal--visible']]: props.visible },
      ])}
    >
      <header className={styles['camera-modal__header']}>
        <button className={styles['camera-modal__header__close']} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <Camera ref={camera} className={styles['camera-modal__video']} onClose={onClose} onScan={handleScan} />
    </div>
  );
};

export default CameraModal;
