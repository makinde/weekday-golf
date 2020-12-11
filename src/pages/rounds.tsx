import React, { useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { Row, Col } from 'react-bootstrap';

import sdk from '../sdk';
import Layout from '../components/utils/Layout';
import PlayerRoundsChart from '../components/Chart/PlayerRoundsChart';
import LeaderboardCard from '../components/visualization/LeaderboardCard';
import { DefaultCourseRoundsPageQuery } from '../types';
import RoundCard from '../components/visualization/RoundCard';

type Props = DefaultCourseRoundsPageQuery;

const CourseRoundsPage: NextPage<Props> = ({
  course,
  rounds,
  roundsForChart,
  leaderboardPlayerRounds,
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
          <LeaderboardCard
            playerRounds={leaderboardPlayerRounds}
          />
        </Col>
        <Col md={7}>
          {rounds.map((round) => (
            <RoundCard key={round.id} round={round} />
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
