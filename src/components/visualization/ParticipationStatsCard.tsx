import React from 'react';
import { Card, Table } from 'react-bootstrap';
import round from 'lodash/round';
import Link from 'next/link';

import RelativeScore from '../utils/RelativeScore';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import WinningsPill from '../utils/WinningsPill';

import { CoursePlayerForParticipationStatsCardFragment } from '../../types';

type Props = {
  coursePlayers: CoursePlayerForParticipationStatsCardFragment[],
};

const PlayerCourseStatsCard = ({ coursePlayers }: Props) => (
  <Card>
    <Card.Header>
      <CardHeaderTitle>
        Pariticipation
      </CardHeaderTitle>
    </Card.Header>
    <Table size="sm" className="table-nowrap card-table" responsive>
      <thead>
        <tr>
          <th className="w-50">Name</th>
          <th>Avg Score</th>
          <th>Rounds</th>
          <th>RNDs Won</th>
          <th>Winnings</th>
        </tr>
      </thead>
      <tbody className="list">
        {coursePlayers.map((coursePlayer) => {
          const { course: { slug: courseSlug } } = coursePlayer;
          const { player: { id, nickname, slug: playerSlug } } = coursePlayer;
          const { playerRoundsStats: { aggregate: stats } } = coursePlayer;
          const { winningStats: { aggregate: { count: roundsWon } } } = coursePlayer;

          return (
            <tr key={id}>
              <td>
                <Link href={`/${courseSlug}/${playerSlug}`}>
                  <a>
                    {nickname}
                  </a>
                </Link>
              </td>
              <td><RelativeScore value={round(stats.avg.relativeScore, 2)} /></td>
              <td>{stats.count}</td>
              <td>{roundsWon}</td>
              <td><WinningsPill value={stats.sum.totalWinnings} /></td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  </Card>
);

export default PlayerCourseStatsCard;
