import Link from 'next/link';
import React from 'react';
import { Table, Card } from 'react-bootstrap';

import ScoresHeader from './ScoresHeader';
import CardHeaderTitle from '../utils/CardHeaderTitle';

import { CourseForScoringStatsCardFragment } from '../../types';

type Props = {
  course: CourseForScoringStatsCardFragment,
};

const ScoringStatsCard = ({ course }: Props) => {
  const {
    slug: courseSlug,
    holesForScoringStatsCard: holes,
    coursePlayers,
  } = course;

  return (
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
          {coursePlayers.map(({ player, scoringInfo }) => (
            <tr key={player.id}>
              <td className="border-right">
                <Link href={`/${courseSlug}/${player.slug}`}>
                  <a className="text-reset">
                    {player.nickname}
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
};

export default ScoringStatsCard;
