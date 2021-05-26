import React from 'react';
import Link from 'next/link';

import RoundCard from './RoundCard';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import { useRoundCardList } from '../../apiHooks';

type Props = {
  courseId?: number,
  playerId?: number,
  limit?: number,
};

const RoundCardList = ({ courseId, playerId, limit }: Props) => {
  const { data } = useRoundCardList({ courseId, playerId, limit });

  const rounds = data?.rounds ?? [];
  const singleRound = limit === 1;

  return (
    <>
      {rounds.map((round) => (
        <RoundCard
          key={round.id}
          round={round}
          canShare={singleRound}
          title={singleRound && (
            <CardHeaderTitle>
              Latest Round
              <Link
                href={playerId ? '#rounds' : `/${round.course.slug}/rounds`}
                data-html2canvas-ignore
              >
                <a className="small ml-3 text-primary ">
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
