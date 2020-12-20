import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Row, Col } from 'react-bootstrap';

import sdk from '../../sdk';
import Layout from '../../components/utils/Layout';
import PlayerRoundsChart from '../../components/Chart/PlayerRoundsChart';
import LeaderboardCard from '../../components/card/LeaderboardCard';
import { CourseForRoundsPageFragment } from '../../types';
import RoundCardList from '../../components/card/RoundCardList';
import PageHeader from '../../components/utils/PageHeader';

type Props = {
  course: CourseForRoundsPageFragment,
};

const CourseRoundsPage: NextPage<Props> = ({ course }) => {
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

type PageQuery = { courseSlug: string };
type StaticProps = GetStaticProps<Props, PageQuery>;

const getStaticProps: StaticProps = async ({ params }) => {
  const { courseSlug: slug } = params;
  const { courses } = await sdk.courseRoundsPage({ slug });

  if (courses.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      course: courses[0],
    },
    revalidate: 60,
  };
};

const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
  const { courses } = await sdk.courseRoundsPagePaths();

  return {
    paths: courses.map(({ slug }) => ({ params: { courseSlug: slug } })),
    fallback: false,
  };
};

export {
  getStaticProps,
  getStaticPaths,
  CourseRoundsPage as default,
};
