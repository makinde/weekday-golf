import React from 'react';
import useSWR from 'swr';

import StatCard from '../../utils/StatCard';
import sdk from '../../../sdk';

type Props = {
  courseId?: number,
  playerId?: number,
};

const RoundsWonStatCard = ({ courseId, playerId }: Props) => {
  const { data } = useSWR(
    ['RoundsWonStatCard', courseId, playerId],
    () => sdk.roundsWonStatCard({ courseId, playerId }),
  );

  const winnings = data?.playerRoundStats?.aggregate?.count;
  let heading;
  if (winnings === 0) {
    heading = 'Unfeated';
  } else if (winnings === undefined) {
    heading = '-';
  } else {
    heading = winnings;
  }

  return (
    <StatCard
      title="Rounds Won"
      heading={heading}
    />
  );
};

export default RoundsWonStatCard;
