import React from 'react';
import { Badge } from 'react-bootstrap';

type Props = React.HTMLAttributes<any> & {
  value: number,
};

const winningsText = (value: number) => `${value < 0 ? '-' : ''}$${Math.abs(value)}`;

const WinningsPill = ({ value, ...props }: Props) => {
  if (value === null) { return null; }

  let pillVariant = 'secondary';
  if (value > 0) { pillVariant = 'success'; }
  if (value < 0) { pillVariant = 'danger'; }

  return (
    <Badge pill variant={pillVariant} {...props}>
      {winningsText(value)}
    </Badge>
  );
};

export {
  winningsText,
  WinningsPill,
};
