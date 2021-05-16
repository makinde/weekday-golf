import React from 'react';

import StatCard from '../../utils/StatCard';
import { useRoundsWonStatCard } from '../../../apiHooks';

type Props = {
  courseId?: number,
  playerId?: number,
};

const RoundsWonStatCard = ({ courseId, playerId }: Props) => {
  const { data } = useRoundsWonStatCard({ courseId, playerId });

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
