import React from 'react';
import useSWR from 'swr';

import StatCard from '../../utils/StatCard';
import sdk from '../../../sdk';

type Props = {
  courseId: number,
  playerId?: number,
};

const RoundsPlayedStatCard = ({ courseId, playerId }: Props) => {
  const { data } = useSWR(
    ['RoundsPlayedStatCard', courseId, playerId],
    () => (
      playerId
        ? sdk.roundsPlayedStatCardForPlayer({ courseId, playerId })
        : sdk.roundsPlayedStatCard({ courseId })
    ),
  );

  return (
    <StatCard
      title="Rounds Played"
      heading={data?.scope?.roundStats?.aggregate?.count || '-'}
    />
  );
};

export default RoundsPlayedStatCard;
