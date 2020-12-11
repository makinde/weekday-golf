import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { Card, Table } from 'react-bootstrap';

import RelativeScore from '../utils/RelativeScore';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import CompactDate from '../utils/CompactDate';

import {
  PlayerRoundForCourseLeaderboardFragment,
  PlayerRoundForPlayerLeaderboardFragment,
} from '../../types';

type PRFrag = PlayerRoundForCourseLeaderboardFragment |
PlayerRoundForPlayerLeaderboardFragment;
type Props = {
  playerRounds: PRFrag[],
};

const LeaderboardCard = ({ playerRounds, ...props }: Props) => {
  const playerRoundsByRank = groupBy(playerRounds, 'rank');
  const groupedRounds = sortBy(Object.values(playerRoundsByRank), '0.rank');

  return (
    <Card {...props}>
      <Card.Header>
        <CardHeaderTitle>
          Top Rounds
        </CardHeaderTitle>
      </Card.Header>
      <Table size="sm" className="table-nowrap card-table" responsive>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Rnd</th>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody className="list">
          {groupedRounds.map((roundsForRank) => {
            const { rank, relativeScore } = roundsForRank[0];

            return (
              <tr key={`${rank}`}>
                <td>{rank}</td>
                <td><RelativeScore value={relativeScore} /></td>
                <td>
                  {roundsForRank.map((
                    { player: { nickname } }, idx,
                  ) => (
                    <React.Fragment key={nickname}>
                      {idx !== 0 && (<br />)}
                      {nickname}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {roundsForRank.map((
                    { round: { date } }, idx,
                  ) => (
                    <React.Fragment key={`${relativeScore}-${date}`}>
                      {idx !== 0 && (<br />)}
                      <CompactDate
                        date={date}
                        dateFormat="MMM d"
                        yearFormat=" ''yy"
                      />
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};

export default LeaderboardCard;
