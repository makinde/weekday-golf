import React from 'react';
import useSWR from 'swr';

import round from 'lodash/round';
import StatCard from '../../utils/StatCard';
import sdk from '../../../sdk';
import RelativeScore from '../../utils/RelativeScore';

type Props = {
  courseId?: number,
  playerId?: number,
};

const AverageScoreStatCard = ({ courseId, playerId }: Props) => {
  const { data } = useSWR(
    ['AverageScoreStatCard', courseId, playerId],
    () => sdk.averageScoreStatCard({ courseId, playerId }),
  );

  const avg = data?.playerRoundStats?.aggregate?.avg?.relativeScore;

  return (
    <StatCard
      title="Avg Score"
      heading={avg === null ? '-' : (
        <RelativeScore value={round(avg, 2)} />
      )}
    />
  );
};

export default AverageScoreStatCard;
