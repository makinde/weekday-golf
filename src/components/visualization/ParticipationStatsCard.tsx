import React from 'react';
import { Card, Table } from 'react-bootstrap';
import round from 'lodash/round';

import RelativeScore from '../utils/RelativeScore';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import WinningsPill from '../utils/WinningsPill';

import { ParticipationStatsForCardFragment } from '../../types';

type Props = {
  players: ParticipationStatsForCardFragment[],
};

const PlayerCourseStatsCard = ({ players }: Props) => (
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
        {players.map((player) => {
          const { id, nickname } = player;
          const { playerRoundsStats: { aggregate: stats } } = player;
          const { winningStats: { aggregate: { count: roundsWon } } } = player;

          return (
            <tr key={id}>
              <td>{nickname}</td>
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
