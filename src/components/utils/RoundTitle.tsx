import React from 'react';
import { parseISO } from 'date-fns';

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
    </>
  );
};

export default RoundTitle;
