import cx from 'classnames';
import React from 'react';
import Table from 'react-bootstrap/Table';

import styles from './AppTable.module.scss';

const AppTable = ({
  className = '',
  responsive = true,
  size = 'sm',
  ...props
}) => (
  <Table
    {...props}
    responsive={responsive}
    size={size}
    className={cx(styles.appTable, className)}
  />
);

export default AppTable;
