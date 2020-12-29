import React from 'react';
import useSWR from 'swr';

import StatCard from '../../utils/StatCard';
import sdk from '../../../sdk';
import { winningsText } from '../../utils/Winnings';

type Props = {
  courseId?: number,
  playerId?: number,
};

const WinningsStatCard = ({ courseId, playerId }: Props) => {
  const { data } = useSWR(
    ['WinningsStatCard', courseId, playerId],
    () => sdk.winningsStatCard({ courseId, playerId }),
  );

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
