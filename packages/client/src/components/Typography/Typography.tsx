import { ComponentType, useMemo } from 'react';
import classNames from 'classnames';

import styles from './Typography.module.scss';

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type Type = 'title' | 'body';

export type TypographyProps<T extends keyof JSX.IntrinsicElements> = {
  children?: React.ReactNode;
  className?: string;
  variant?: `${Type}${Level}`;
  element?: ComponentType | T;
} & JSX.IntrinsicElements[T];

function Typography<T extends keyof JSX.IntrinsicElements = 'p'>(props: TypographyProps<T>) {
  const { className, children, element, variant = 'body1', ...restProps } = props;

  const Element: ComponentType | string = useMemo(() => {
    if (element) {
      return element;
    }

    if (variant.startsWith('title')) {
      return variant.replace('title', 'h');
    }

    if (variant.startsWith('caption')) {
      return 'span';
    }

    return 'p';
  }, [element, variant]);

  return (
    <Element
      {...restProps}
      className={classNames([
        className,
        styles['typography'],
        {
          [styles[`typography--variant-${variant.match(/^(title|subtitle|body|caption)/)?.[0]}`]]: true,
          [styles[`typography--variant-${variant}`]]: true,
        },
      ])}
    >
      {children}
    </Element>
  );
}

Typography.displayName = 'Typography';

export default Typography;
