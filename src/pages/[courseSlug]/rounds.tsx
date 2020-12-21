import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { Row, Col } from 'react-bootstrap';

import { getStaticPaths } from './index';
import sdk from '../../sdk';
import Layout from '../../components/utils/Layout';
import PlayerRoundsChart from '../../components/Chart/PlayerRoundsChart';
import LeaderboardCard from '../../components/card/LeaderboardCard';
import { CourseForRoundsPage } from '../../types';
import RoundCardList from '../../components/card/RoundCardList';
import PageHeader from '../../components/utils/PageHeader';

type PageQuery = { courseSlug: string };
type StaticProps = GetStaticProps<Props, PageQuery>;
type Props = { course: CourseForRoundsPage };

const CourseRoundsPage = ({ course }: Props) => {
  const [focusedPlayerId, setFocusedPlayerId] = useState<number | null>(null);
  const [focusedRoundId, setFocusedRoundId] = useState<number | null>(null);

  return (
    <Layout title={`${course.name} Rounds`}>
      <PageHeader>
        <Row className="align-items-center">
          <Col>
            <PageHeader.PreTitle>{course.name}</PageHeader.PreTitle>
            <PageHeader.Title>
              Rounds
            </PageHeader.Title>
          </Col>
        </Row>
      </PageHeader>

      <Row>
        <Col md={5}>
          <PlayerRoundsChart
            playerRounds={course.playerRounds}
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

const getStaticProps: StaticProps = async ({ params }) => {
  const { courseSlug: slug } = params;
  const { courses } = await sdk.courseRoundsPage({ slug });

  return {
    props: {
      course: courses[0],
    },
    revalidate: 60,
  };
};

export {
  getStaticProps,
  getStaticPaths,
  CourseRoundsPage as default,
};
