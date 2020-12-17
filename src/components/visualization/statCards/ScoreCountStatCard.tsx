import React from 'react';
import useSWR from 'swr';

import StatCard from '../../utils/StatCard';
import sdk from '../../../sdk';

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
  const { data } = useSWR(
    ['ScoreCountStatCard', courseId, playerId, relativeScoreCutoff],
    () => sdk.scoreCountStatCard({ courseId, playerId, relativeScoreCutoff }),
  );

  return (
    <StatCard
      title="Par Or Better"
      heading={data?.scoringStats?.aggregate?.count || '-'}
    />
  );
};

export default ScoreCountStatCard;
