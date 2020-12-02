import cx from 'classnames';
import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

import styles from './styles/Axis.module.scss';

const Axis = ({ axis, className = '', ...props }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      d3.select(containerRef.current).call(axis);
    }
  }, [axis]);

  return (
    <g
      {...props}
      className={cx(styles.axis, className)}
      ref={containerRef}
    />
  );
};

export default Axis;
