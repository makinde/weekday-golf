import React from 'react';

import round from 'lodash/round';
import StatCard from '../../utils/StatCard';
import RelativeScore from '../../utils/RelativeScore';
import { useAverageScoreStatCard } from '../../../apiHooks';

type Props = {
  courseId?: number,
  playerId?: number,
};

const AverageScoreStatCard = ({ courseId, playerId }: Props) => {
  const { data } = useAverageScoreStatCard({ courseId, playerId });

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
