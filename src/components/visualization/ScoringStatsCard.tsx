import Link from 'next/link';
import React from 'react';
import { Table, Card } from 'react-bootstrap';

import ScoresHeader from './ScoresHeader';
import CardHeaderTitle from '../utils/CardHeaderTitle';

import {
  ScoringStatsForCardFragment,
  HoleForScoresHeaderFragment,
} from '../../types';

type Props = {
  players: ScoringStatsForCardFragment[],
  holes: HoleForScoresHeaderFragment[]
};

const ScoringStatsCard = ({ players, holes }: Props) => (
  <Card>
    <Card.Header>
      <CardHeaderTitle>
        Scoring Stats
      </CardHeaderTitle>
    </Card.Header>
    <Table
      size="sm"
      responsive
      className="table-nowrap card-table"
    >
      <ScoresHeader holes={holes} id="scording-card" showTotal={false} />
      <tbody>
        {players.map(({
          id, nickname, scoringInfo,
        }) => (
          <tr key={id}>
            <td className="border-right">
              <Link href={`/player/${id}`}>
                <a className="text-reset">
                  {nickname}
                </a>
              </Link>
            </td>
            {scoringInfo.map((info) => (
              <td key={info.holeNumber}>
                {info.trailingAvgScore}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);

export default ScoringStatsCard;
