import { FC } from 'react';

import styles from './Input.module.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: FC<InputProps> = (props) => {
  return <input className={styles['input']} {...props} />;
};

Input.displayName = 'Input';

export default Input;
