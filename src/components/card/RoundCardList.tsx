import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';

import sdk from '../../sdk';
import RoundCard from './RoundCard';
import CardHeaderTitle from '../utils/CardHeaderTitle';

type Props = {
  courseId?: number,
  playerId?: number,
  limit?: number,
};

const RoundCardList = ({ courseId, playerId, limit }: Props) => {
  const { data } = useSWR(
    ['RoundCardList', courseId, playerId, limit],
    () => sdk.roundCardList({ courseId, playerId, limit }),
  );

  const rounds = data?.rounds ?? [];
  const singleRound = limit === 1;

  return (
    <>
      {rounds.map((round) => (
        <RoundCard
          key={round.id}
          round={round}
          title={singleRound && (
            <CardHeaderTitle>
              Latest Round
              <Link href={playerId ? '#rounds' : `/${round.course.slug}/rounds`}>
                <a className="small ml-3 text-primary">
                  See all
                </a>
              </Link>
            </CardHeaderTitle>
          )}
        />
      ))}
    </>
  );
};

export default RoundCardList;
