import React, { useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { Row, Col } from 'react-bootstrap';
import { parseISO, format } from 'date-fns';

import sdk from '../sdk';
import Layout from '../components/utils/Layout';
import PlayerRoundsChart from '../components/Chart/PlayerRoundsChart';
import Leaderboard from '../components/visualization/Leaderboard';
import { DefaultCourseRoundsPageQuery } from '../types';
import RoundTable from '../components/visualization/RoundTable';
import CompactDate from '../components/utils/CompactDate';

type Props = DefaultCourseRoundsPageQuery;

const CourseRoundsPage: NextPage<Props> = ({
  course,
  roundsForChart,
  leaderboardEntries,
  roundsForTable,
}) => {
  const [focusedPlayerId, setFocusedPlayerId] = useState<number | null>(null);
  const [focusedRoundId, setFocusedRoundId] = useState<number | null>(null);

  return (
    <Layout title={`${course.name} Rounds`}>
      <h1>
        Rounds
      </h1>

      <Row>
        <Col md={5}>
          <PlayerRoundsChart
            playerRounds={roundsForChart}
            focusedPlayerId={focusedPlayerId}
            focusedRoundId={focusedRoundId}
            onPlayerFocus={setFocusedPlayerId}
            onRoundFocus={setFocusedRoundId}
          />
          <Leaderboard
            entries={leaderboardEntries}
            focusedRoundId={focusedRoundId}
            onRoundFocus={setFocusedRoundId}
          />
        </Col>
        <Col md={7}>
          {roundsForTable.map((round) => (
            <React.Fragment key={round.id}>
              <h3>
                {!!round.name && (
                  <>
                    {round.name}
                    {' '}
                    on
                    {' '}
                    <CompactDate date={round.date} />
                  </>
                )}
                {!round.name && format(parseISO(round.date), 'EEEE MMM do, y')}
              </h3>
              <RoundTable round={round} />
            </React.Fragment>
          ))}
        </Col>
      </Row>
    </Layout>
  );
};

const getStaticProps: GetStaticProps<Props> = async () => {
  const props = await sdk.defaultCourseRoundsPage({ courseId: 1 });

  return {
    props,
  };
};

export {
  getStaticProps,
  CourseRoundsPage as default,
};
