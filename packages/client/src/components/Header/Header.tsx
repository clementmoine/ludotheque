import classNames from 'classnames';
import { Item } from '@prisma/client';
import { FC, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Icon from 'components/Icon';
import Image from 'components/Image';
import Button from 'components/Button';
import Typography from 'components/Typography';

import { LocationState } from 'routes';

import styles from './CollectionItem.module.scss';

export type HeaderProps = React.HTMLAttributes<HTMLElement>;

const Header: FC<HeaderProps> = (props) => {
  return (
    <header>
      <Typography>{title}</Typography>
    </header>
  );
};
