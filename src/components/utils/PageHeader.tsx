import React from 'react';

type Props = React.PropsWithChildren<{}>;

const PageHeader = ({ children }: Props) => (
  <div className="header">
    <div className="header-body">
      {children}
    </div>
  </div>
);

PageHeader.Title = ({ children }: Props) => (
  <h1 className="header-title">
    {children}
  </h1>
);

PageHeader.PreTitle = ({ children }: Props) => (
  <h6 className="header-pretitle">
    {children}
  </h6>
);

export default PageHeader;
