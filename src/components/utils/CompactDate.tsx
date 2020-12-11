import React, { Fragment } from 'react';
import { parseISO, format } from 'date-fns';

type Props = {
  date: string,
  dateFormat?: string,
  yearFormat?: string,
};

const CompactDate = ({
  date: stringDate,
  dateFormat = 'MMM do',
  yearFormat = ', y',
}: Props) => {
  const date = parseISO(stringDate);
  const isSameYear = date.getFullYear() === new Date().getFullYear();
  const dateTpl = isSameYear ? dateFormat : `${dateFormat}${yearFormat}`;

  return <>{format(date, dateTpl)}</>;
};

export default CompactDate;
