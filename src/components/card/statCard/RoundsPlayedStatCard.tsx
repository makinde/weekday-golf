import React from 'react';
import { useQuery } from 'react-query';

import StatCard from '../../utils/StatCard';
import graphqlClient from '../../../graphqlClient';
import { RoundsPlayedStatCardDocument, RoundsPlayedStatCardForPlayerDocument } from '../../../apiHooks';

type Props = {
  courseId: number,
  playerId?: number,
};

const RoundsPlayedStatCard = ({ courseId, playerId }: Props) => {
  const variables = { courseId, playerId };
  const queryDoc = playerId
    ? RoundsPlayedStatCardForPlayerDocument
    : RoundsPlayedStatCardDocument;
  const { data } = useQuery(
    ['RoundsPlayedStatCard', variables],
    () => graphqlClient.request(queryDoc, variables),
  );

  return (
    <StatCard
      title="Rounds Played"
      heading={data?.scope?.roundStats?.aggregate?.count || '-'}
    />
  );
};

export default RoundsPlayedStatCard;
