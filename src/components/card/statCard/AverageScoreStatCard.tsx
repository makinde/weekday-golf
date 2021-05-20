import React from 'react';

import round from 'lodash/round';
import StatCard from '../../utils/StatCard';
import RelativeScore from '../../utils/RelativeScore';
import Sparkline from '../../utils/Sparkline';
import { useAverageScoreStatCard } from '../../../apiHooks';

type Props = {
  courseId?: number,
  playerId?: number,
};

const AverageScoreStatCard = ({ courseId, playerId }: Props) => {
  const { data } = useAverageScoreStatCard({ courseId, playerId });

  const avg = data?.playerRoundStats?.aggregate?.avg?.relativeScore;
  const rounds = data?.rounds ?? [];
  const filteredRounds = rounds.filter(
    (r) => r?.playerRounds_aggregate?.aggregate?.avg?.score,
  );

  return (
    <StatCard
      title="Avg Score"
      heading={avg === null ? '-' : (
        <RelativeScore value={round(avg, 2)} />
      )}
      extra={filteredRounds.length > 2 && (
        <Sparkline
          data={filteredRounds}
          dataKey="playerRounds_aggregate.aggregate.avg.score"
          id={`AverageScoreStatCard:${courseId}:${playerId}`}
        />
      )}
    />
  );
};

export default AverageScoreStatCard;
