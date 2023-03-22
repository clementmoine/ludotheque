import { FC, ImgHTMLAttributes, SyntheticEvent, useCallback, useState } from 'react';
import classNames from 'classnames';

import styles from './Image.module.scss';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

const Icon: FC<ImageProps> = (props) => {
  const { alt, title, onLoad, className, onError, ...restProps } = props;

  const [error, setError] = useState<boolean>(false);

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      setError(true);

      if (onError) {
        onError(e);
      }
    },
    [onError]
  );

  const handleLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      setError(false);

      if (onLoad) {
        onLoad(e);
      }
    },
    [onLoad]
  );

  return (
    <img
      {...restProps}
      alt={alt}
      title={title}
      onLoad={handleLoad}
      onError={handleError}
      className={classNames(styles['image'], className, {
        [styles['image--has-error']]: error,
      })}
    />
  );
};

Icon.displayName = 'Icon';

export default Icon;
