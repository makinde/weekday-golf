import React from 'react';
import map from 'lodash/map';

import StatCard from '../../utils/StatCard';
import Sparkline from '../../utils/Sparkline';
import { cumulativeSeries } from '../../../dataSeriesUtils';
import { useScoreCountStatCard } from '../../../apiHooks';

type Props = {
  courseId?: number,
  playerId?: number,
  relativeScoreCutoff?: number
};

const ScoreCountStatCard = ({
  courseId,
  playerId,
  relativeScoreCutoff = 0,
}: Props) => {
  const { data } = useScoreCountStatCard({ courseId, playerId, relativeScoreCutoff });

  const counts = map(data?.rounds || [], 'scoringInfo_aggregate.aggregate.count');
  const cumCounts = cumulativeSeries(counts);

  return (
    <StatCard
      title="Par Or Better"
      heading={data?.scoringStats?.aggregate?.count ?? '-'}
      extra={cumCounts.length > 2 && (
        <Sparkline data={cumCounts} id={`ScoreCountStatCard:${courseId}:${playerId}`} />
      )}
    />
  );
};

export default ScoreCountStatCard;
