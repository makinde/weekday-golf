import React from 'react';

import StatCard from '../../utils/StatCard';
import { winningsText } from '../../utils/Winnings';
import { useWinningsStatCard } from '../../../apiHooks';

type Props = {
  courseId?: number,
  playerId?: number,
};

const WinningsStatCard = ({ courseId, playerId }: Props) => {
  const { data } = useWinningsStatCard({ courseId, playerId });

  const winnings = data?.playerRoundStats?.aggregate?.sum?.totalWinnings;
  let heading;
  if (winnings === null) {
    heading = 'Doesn\'t Gamble';
  } else if (winnings === undefined) {
    heading = '-';
  } else {
    heading = winningsText(winnings);
  }

  return (
    <StatCard
      title="Winnings"
      heading={heading}
    />
  );
};

export default WinningsStatCard;
