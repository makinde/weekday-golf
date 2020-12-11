import React from 'react';

type Props = React.PropsWithChildren<{
  as?: React.ElementType,
}>;

const CardHeaderTitle = ({
  as: AsComponent = 'h4',
  children,
}: Props) => (
  <AsComponent className="card-header-title">
    {children}
  </AsComponent>
);

export default CardHeaderTitle;
