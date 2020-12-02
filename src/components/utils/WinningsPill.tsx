import React from 'react';
import { Badge } from 'react-bootstrap';

type Props = React.HTMLAttributes<any> & {
  value: number,
};

const WinningsPill = ({ value, ...props }: Props) => {
  if (value === null) { return null; }

  let pillVariant = 'secondary';
  let neg = false;
  if (value > 0) { pillVariant = 'success'; }
  if (value < 0) {
    pillVariant = 'danger';
    neg = true;
  }

  return (
    <Badge pill variant={pillVariant} {...props}>
      {neg && '-'}
      $
      {Math.abs(value)}
    </Badge>
  );
};

export default WinningsPill;
