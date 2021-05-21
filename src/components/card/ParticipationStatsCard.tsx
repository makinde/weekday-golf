import React from 'react';
import { Card, Table } from 'react-bootstrap';
import round from 'lodash/round';
import Link from 'next/link';
import { ReferenceLine } from 'recharts';

import RelativeScore from '../utils/RelativeScore';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import { WinningsPill } from '../utils/Winnings';
import Sparkline from '../utils/Sparkline';
import { cumulativeSeries } from '../../dataSeriesUtils';
import { useParticipationStatsCard } from '../../apiHooks';

type Props = {
  courseId: number,
};

const ParticipationStatsCard = ({ courseId }: Props) => {
  const { data } = useParticipationStatsCard({ courseId });

  const { slug: courseSlug, coursePlayers = [] } = data?.course ?? {};

  const showWinnings = coursePlayers.some(
    (cp) => cp?.playerRoundsStats?.aggregate?.sum?.totalWinnings !== null,
  );

  return (
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
            {showWinnings && (<th>Winnings</th>)}
          </tr>
        </thead>
        <tbody className="list">
          {coursePlayers.map((coursePlayer) => {
            const { player: { id, nickname, slug: playerSlug } } = coursePlayer;
            const { playerRoundScores, playerRoundWinnings } = coursePlayer;
            const { playerRoundsStats: { aggregate: stats } } = coursePlayer;
            const { winningStats: { aggregate: { count: roundsWon } } } = coursePlayer;

            const roundedRelativeScore = stats.avg.relativeScore === null
              ? null
              : round(stats.avg.relativeScore, 2);
            const roundWinnings = playerRoundWinnings.map((pr) => pr.totalWinnings);
            const cumWinnings = cumulativeSeries(roundWinnings);

            return (
              <tr key={id}>
                <td>
                  <Link href={`/${courseSlug}/${playerSlug}`}>
                    <a className="text-reset">
                      {nickname}
                    </a>
                  </Link>
                </td>
                <td>
                  <RelativeScore value={roundedRelativeScore} />
                  {stats.count > 3 && (
                    <Sparkline
                      data={playerRoundScores}
                      dataKey="score"
                      id="ParticipationStatsCard:Score"
                    />
                  )}
                </td>
                <td>{stats.count}</td>
                <td>{roundsWon || '-'}</td>
                {showWinnings && (
                  <td>
                    <WinningsPill value={stats.sum.totalWinnings} />
                    {playerRoundWinnings.length > 1 && (
                      <Sparkline
                        data={cumWinnings}
                        id="ParticipationStatsCard:Winnings"
                        type="monotoneX"
                        stroke={stats.sum.totalWinnings > 0 ? '#00D97E' : '#E63757'}
                      >
                        <ReferenceLine ifOverflow="extendDomain" y={0} stroke="grey" strokeDasharray="3 3" />
                      </Sparkline>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};

export default ParticipationStatsCard;
