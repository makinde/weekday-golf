import React from 'react';
import { parseISO } from 'date-fns';

import CompactDate from './CompactDate';

type Props = {
  date: string,
  name?: string,
};

const RoundTitle = ({ date, name }: Props) => {
  const parsedDate = parseISO(date);

  let displayName = name;
  if (!name) {
    const hours = parsedDate.getHours();
    let timeOfDay = 'Morning';
    if (hours > 11) { timeOfDay = 'Afternoon'; }
    if (hours > 16) { timeOfDay = 'Evening'; }
    displayName = `${timeOfDay} Round`;
  }

  return (
    <>
      {displayName}
      {' '}
      on
      {' '}
      <CompactDate date={date} />
    </>
  );
};

export default RoundTitle;
