import React, { Fragment } from 'react';
import { parseISO, format } from 'date-fns';

type Props = {
  date: string,
};

const CompactDate = ({ date: stringDate }: Props) => {
  const date = parseISO(stringDate);
  const isSameYear = date.getFullYear() === new Date().getFullYear();
  const dateTpl = isSameYear ? 'MMM do' : 'MMM do, y';

  return <>{format(date, dateTpl)}</>;
};

export default CompactDate;
