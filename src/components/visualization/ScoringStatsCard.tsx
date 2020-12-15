import Link from 'next/link';
import React, { useState } from 'react';
import {
  Table, Card, Nav, Badge,
} from 'react-bootstrap';
import useSWR from 'swr';
import cx from 'classnames';

import ScoresHeader from './ScoresHeader';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import sdk from '../../sdk';

const MIN_COUNT_CUTOFF = 3;
const TRENDING_CUTOFF = 0.4;
const VIEWS = {
  RECENT: 'recent',
  ALL_TIME: 'all-time',
};

type Props = {
  courseId: number,
};

const ScoringStatsCard = ({ courseId }: Props) => {
  const [view, setView] = useState(VIEWS.RECENT);
  const viewingRecent = view === VIEWS.RECENT;
  const viewingAll = view === VIEWS.ALL_TIME;

  const { data, error } = useSWR(
    `ScoringStatsCard:${courseId}`,
    () => sdk.scoringStatsCard({ courseId }),
  );
  const { course } = data || {};
  const { holes, coursePlayers } = course || {};

  return (
    <Card>
      <Card.Header>
        <CardHeaderTitle>
          Scoring Stats
        </CardHeaderTitle>
        <Nav as="ul" className="nav-tabs nav-tabs-sm card-header-tabs">
          <Nav.Item as="li">
            <Nav.Link
              active={viewingRecent}
              onClick={() => setView(VIEWS.RECENT)}
            >
              Recent
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link
              active={viewingAll}
              onClick={() => setView(VIEWS.ALL_TIME)}
            >
              All-time
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      {!data && (
        <Card.Body className="text-muted">
          {error ? 'Oops! Something went wrong.' : 'Loading...'}
        </Card.Body>
      )}
      {data && (
        <>
          <Table
            size="sm"
            responsive
            className="table-nowrap card-table border-bottom"
          >
            <ScoresHeader holes={holes} id="scording-card" showTotal={false} />
            <tbody>
              {coursePlayers.map(({ player, scoringInfo }) => {
                const notEnoughRounds = scoringInfo[0].trailingCount < MIN_COUNT_CUTOFF;

                return (
                  <tr
                    key={player.id}
                    className={cx({ 'bg-lighter font-italic': notEnoughRounds })}
                  >
                    <td className="border-right">
                      <Link href={`/${course.slug}/${player.slug}`}>
                        <a className="text-reset">
                          {player.nickname}
                        </a>
                      </Link>
                    </td>
                    {scoringInfo.map((info) => (
                      <td key={info.holeNumber}>
                        {viewingRecent && info.trailingAvgScore}
                        {viewingAll && info.lifetimeAvgScore}
                        {Math.abs(info.scoreTrend) > TRENDING_CUTOFF && (
                          <i className={cx('fe ml-2 mt-1 position-absolute', {
                            'fe-chevrons-up text-danger': info.scoreTrend > 0,
                            'fe-chevrons-down text-success': info.scoreTrend < 0,
                          })}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Card.Body className="small">
            Recent includes last 8 rounds.
            <br />
            <Badge variant="light" className="font-italic">Noted</Badge>
            players have played fewer than
            {' '}
            {MIN_COUNT_CUTOFF}
            {' '}
            rounds.
          </Card.Body>
        </>
      )}
    </Card>
  );
};

export default ScoringStatsCard;
