import cx from 'classnames';
import React from 'react';
import { Table as RBTable } from 'react-bootstrap';

import styles from './Table.module.scss';

type RowHeaderProps = React.HTMLAttributes<any> & {
  as?: React.ElementType | string,
};
const RowHeader = ({ as: AsComponent = 'td', className = '', ...props }: RowHeaderProps) => (
  <AsComponent
    {...props}
    className={cx(styles.rowHeader, className)}
  />
);

type RowFooterProps = React.HTMLAttributes<any> & {
  as?: React.ElementType,
};
const RowFooter = ({ as: AsComponent = 'td', className = '', ...props }: RowFooterProps) => (
  <AsComponent
    {...props}
    className={cx(styles.rowFooter, className)}
  />
);

type HighlightableCellProps = React.HTMLAttributes<any> & {
  as?: React.ElementType,
  highlight?: boolean,
  light?: boolean,
};
const HighlightableCell = ({
  as: AsComponent = 'td',
  highlight,
  light = false,
  className = '',
  ...props
}: HighlightableCellProps) => (
  <AsComponent
    {...props}
    className={cx({
      [styles.highlightCell]: highlight,
      [styles.light]: light,
    }, className)}
  />
);

const Table = ({
  className = '',
  responsive = true,
  size = 'sm',
  ...props
}) => (
  <RBTable
    {...props}
    responsive={responsive}
    size={size}
    className={cx(styles.appTable, className)}
  />
);

export default Object.assign(
  Table,
  { RowHeader, RowFooter, HighlightableCell },
);
