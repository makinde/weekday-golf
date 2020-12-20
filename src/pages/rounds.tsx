import React, { useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { Row, Col } from 'react-bootstrap';

import sdk from '../sdk';
import Layout from '../components/utils/Layout';
import PlayerRoundsChart from '../components/Chart/PlayerRoundsChart';
import LeaderboardCard from '../components/card/LeaderboardCard';
import { DefaultCourseRoundsPageQuery } from '../types';
import RoundCardList from '../components/card/RoundCardList';

type Props = DefaultCourseRoundsPageQuery;

const CourseRoundsPage: NextPage<Props> = ({
  course,
  roundsForChart,
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
          <LeaderboardCard courseId={course.id} />
        </Col>
        <Col md={7}>
          <RoundCardList courseId={course.id} />
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
