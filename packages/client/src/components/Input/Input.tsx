import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { FieldProps, ErrorMessage } from 'formik';
import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  InputHTMLAttributes,
  ChangeEvent,
  KeyboardEvent,
  useRef,
} from 'react';

import Spinner from 'components/Spinner';
import Typography from 'components/Typography';

import Button, { ButtonProps } from 'components/Button';

import styles from './Input.module.scss';
import { mergeRefs } from 'utils/ref/merge';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  size?: 'sm' | 'md' | 'xl';
  label?: string;
  loading?: boolean;
  debounce?: number;
  right?: {
    to?: ButtonProps['to'];
    icon: ButtonProps['icon'];
    onClick?: ButtonProps['onClick'];
  };
  left?: {
    to?: ButtonProps['to'];
    icon: ButtonProps['icon'];
    onClick?: ButtonProps['onClick'];
  };
  onChange: (value: HTMLInputElement['value'], event?: ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps & Partial<FieldProps>>((props, ref) => {
  const {
    type = 'text',
    size = 'md',
    name,
    form,
    left,
    label,
    right,
    field,
    loading,
    onChange,
    className,
    debounce = 0,
    ...restProps
  } = props;

  const inputRef = useRef<HTMLInputElement>();

  const mergedRef = mergeRefs(inputRef, ref);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [timeoutChange, setTimeoutChange] = useState<NodeJS.Timeout>();

  const handleClear = useCallback(() => {
    if (form && field) {
      form.setFieldValue(field.name, '');
      field.onChange('');

      return;
    }

    if (inputRef.current) {
      inputRef.current.value = '';

      onChange('');
    }
  }, [form, field, onChange]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!onChange) {
        return;
      }

      if (timeoutChange) clearTimeout(timeoutChange);

      if (debounce) {
        setTimeoutChange(
          setTimeout(() => {
            onChange(e.target.value, e);
          }, debounce)
        );

        return;
      }

      onChange(e.target.value, e);
    },
    [onChange, timeoutChange, debounce]
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onChange) {
        if (timeoutChange) clearTimeout(timeoutChange);

        onChange(e.currentTarget.value, e as unknown as ChangeEvent<HTMLInputElement>);
      }
    },
    [onChange, timeoutChange]
  );

  const handleTogglePassword = useCallback(() => {
    setPasswordVisible((currentVisible) => !currentVisible);
  }, []);

  const id = useMemo(() => {
    if (field?.name || name) {
      return `${field?.name || name}_${uuidv4()}`;
    }

    return undefined;
  }, [name, field?.name]);

  return (
    <div className={classNames(className, styles['input'], styles[`input--size-${size}`])}>
      {label && (
        <Typography variant="body1" element="label" className={styles['input__label']} htmlFor={id}>
          {label}
        </Typography>
      )}

      <div
        style={{
          '--left-icon-count': [!!left].filter(Boolean).length,
          '--right-icon-count': [!!right, type === 'password', !!field?.value, loading].filter(Boolean)
            .length,
        }}
        className={classNames(styles['input__container'])}
      >
        <div className={styles['input__container__left']}>
          {/* Left button */}
          {left && <Button variant="icon" {...left} className={styles['input__container__left__item']} />}
        </div>

        {/* Input */}
        <input
          id={id}
          ref={mergedRef}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className={styles['input__input']}
          type={type === 'password' && passwordVisible ? 'text' : type}
          {...field}
          {...restProps}
        />

        <div className={styles['input__container__right']}>
          {/* Loader */}
          {loading && <Spinner size="xs" className={styles['input__container__right__item']} />}

          {type === 'password' && (
            <Button
              variant="icon"
              onClick={handleTogglePassword}
              icon={passwordVisible ? 'eye-stroked' : 'eye'}
              className={styles['input__container__right__item']}
            />
          )}

          {/* Right button */}
          {right && <Button variant="icon" className={styles['input__container__right__item']} {...right} />}

          {/* Clear icon */}
          {(field?.value || inputRef.current?.value) && (
            <Button
              variant="icon"
              onClick={handleClear}
              icon="close"
              className={styles['input__container__right__item']}
            />
          )}
        </div>
      </div>

      {field?.name && (
        <ErrorMessage name={field?.name}>
          {(error) => (
            <Typography variant="body1" color="invalid">
              {error}
            </Typography>
          )}
        </ErrorMessage>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
