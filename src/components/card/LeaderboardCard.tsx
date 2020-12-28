import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { Card, Table } from 'react-bootstrap';
import useSWR from 'swr';

import Link from 'next/link';
import RelativeScore from '../utils/RelativeScore';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import CompactDate from '../utils/CompactDate';
import sdk from '../../sdk';

type Props = {
  courseId: number,
  playerId?: number,
  rankLimit?: number,
};

const LeaderboardCard = ({
  courseId,
  playerId,
  rankLimit = 10,
  ...props
}: Props) => {
  const { data } = useSWR(
    ['LeaderboardCard', courseId, playerId, rankLimit],
    () => (
      playerId
        ? sdk.leaderboardCardForPlayer({ courseId, playerId, rankLimit })
        : sdk.leaderboardCard({ courseId, rankLimit })
    ),
  );

  const { slug: courseSlug, playerRounds } = data?.course || {};

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
            {!playerId && (<th>Name</th>)}
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
                {!playerId && (
                  <td>
                    {roundsForRank.map((playerRound, idx) => {
                      const {
                        playerId: pid,
                        roundId,
                        player: { nickname, slug: playerSlug },
                      } = playerRound;

                      return (
                        <React.Fragment key={`${pid}-${roundId}`}>
                          {idx !== 0 && (<br />)}
                          <Link href={`/${courseSlug}/${playerSlug}`}>
                            <a className="text-reset">
                              {nickname}
                            </a>
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </td>
                )}
                <td>
                  {roundsForRank.map((playerRound, idx) => {
                    const {
                      playerId: pid,
                      player: { slug: playerSlug },
                      roundId,
                      round: { date },
                    } = playerRound;
                    const baseUrl = playerId ? `/${courseSlug}/${playerSlug}` : `/${courseSlug}/rounds`;

                    return (
                      <React.Fragment key={`${pid}-${roundId}`}>
                        {idx !== 0 && (<br />)}
                        <Link href={`${baseUrl}#round-${roundId}`}>
                          <a className="text-reset">
                            <CompactDate
                              date={date}
                              dateFormat="MMM d"
                              yearFormat=" ''yy"
                            />
                          </a>
                        </Link>
                      </React.Fragment>
                    );
                  })}
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
