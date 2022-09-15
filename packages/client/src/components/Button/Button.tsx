import classNames from 'classnames';
import { FC, MouseEvent, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import Typography from 'components/Typography';

import { NavigateOptions } from 'routes';

import Color, { getTheme } from 'types/color';

import styles from './Button.module.scss';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  icon?: string;
  color?: Color;
  label?: string;
  loading?: boolean;
  navigateOptions?: NavigateOptions;
  variant?: 'primary' | 'reverse' | 'outline' | 'link' | 'icon';
}

const Button: FC<ButtonProps> = (props) => {
  const {
    to,
    icon,
    color,
    onClick,
    loading,
    children,
    className,
    type = 'button',
    variant = 'primary',
    navigateOptions,
    ...restProps
  } = props;

  const navigate = useNavigate();

  const location = useLocation();

  const label = useMemo(() => {
    if (restProps.label) {
      return restProps.label;
    }

    if (typeof children === 'string') {
      return children;
    }
  }, [children, restProps.label]);

  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (to) {
        navigate(to, {
          ...navigateOptions,
          state: {
            ...navigateOptions?.state,
            from: location,
          },
        });
      }

      if (onClick) {
        onClick(e);
      }
    },
    [to, onClick, navigate, location, navigateOptions]
  );

  return (
    <button
      {...restProps}
      type={type}
      onClick={handleOnClick}
      style={{ '--color': getTheme(color) }}
      className={classNames(
        styles['button'],
        styles[`button--variant-${variant}`],
        {
          [styles['button--has-icon']]: icon,
          [styles['button--has-onClick']]: to || onClick,
        },
        className
      )}
    >
      {loading && <Spinner size="xs" className={classNames(styles['button__spinner'])} />}

      {icon && <Icon className={classNames(styles['button__icon'])} color={color} name={icon} />}

      {label ? (
        <Typography variant="body1" element="span" className={classNames(styles['button__label'])}>
          {label}
        </Typography>
      ) : (
        children
      )}
    </button>
  );
};

Button.displayName = 'Button';

export default Button;
