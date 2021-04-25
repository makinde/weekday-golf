import React from 'react';
import map from 'lodash/map';

import StatCard from '../../utils/StatCard';
import sdk, { useSdk } from '../../../sdk';
import Sparkline from '../../utils/Sparkline';
import { cumulativeSeries } from '../../../dataSeriesUtils';

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
  const { data } = useSdk(
    sdk.scoreCountStatCard,
    { courseId, playerId, relativeScoreCutoff },
  );

  const counts = map(data?.rounds || [], 'scoringInfo_aggregate.aggregate.count');
  const cumCounts = cumulativeSeries(counts);

  return (
    <StatCard
      title="Par Or Better"
      heading={data?.scoringStats?.aggregate?.count ?? '-'}
      extra={<Sparkline data={cumCounts} id={`ScoreCountStatCard:${courseId}:${playerId}`} />}
    />
  );
};

export default ScoreCountStatCard;
