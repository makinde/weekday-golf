import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Row, Col } from 'react-bootstrap';

import graphqlClient from '../../graphqlClient';
import Layout from '../../components/utils/Layout';
import Avatar from '../../components/utils/Avatar';
import PageHeader from '../../components/utils/PageHeader';
import RoundCardList from '../../components/card/RoundCardList';
import LeaderboardCard from '../../components/card/LeaderboardCard';
import RoundsPlayedStatCard from '../../components/card/statCard/RoundsPlayedStatCard';
import ScoreCountStatCard from '../../components/card/statCard/ScoreCountStatCard';
import AverageScoreStatCard from '../../components/card/statCard/AverageScoreStatCard';
import WinningsStatCard from '../../components/card/statCard/WinningsStatCard';
import RoundsWonStatCard from '../../components/card/statCard/RoundsWonStatCard';

import {
  CoursePlayerForPlayerPage,
  CoursePlayerPageDocument,
  CoursePlayerStaticListingDocument,
} from '../../apiHooks';

type PageQuery = { courseSlug: string, playerSlug: string };
type ServerSideProps = GetStaticProps<Props, PageQuery>;
type Props = { coursePlayer: CoursePlayerForPlayerPage };

const CoursePlayerPage = ({
  coursePlayer: {
    courseId, course, playerId, player,
  },
}: Props) => (
  <Layout
    title="Overview"
    focusedCourseId={courseId}
    focusedPlayerId={playerId}
  >
    <PageHeader>
      <Row className="align-items-center">
        {!!player.img && (
          <Col xs="auto">
            <Avatar src={player.img} size="lg" />
          </Col>
        )}
        <Col>
          <PageHeader.Title>
            {player.fullName}
            &nbsp;
            <span className="text-muted">
              @&nbsp;
              {course.name}
            </span>
          </PageHeader.Title>
        </Col>
      </Row>
    </PageHeader>
    <Row>
      <Col sm={4}>
        <RoundsPlayedStatCard courseId={courseId} playerId={playerId} />
        <AverageScoreStatCard courseId={courseId} playerId={playerId} />
        <ScoreCountStatCard courseId={courseId} playerId={playerId} />
        <WinningsStatCard courseId={courseId} playerId={playerId} />
        <RoundsWonStatCard courseId={courseId} playerId={playerId} />
        <LeaderboardCard courseId={courseId} playerId={playerId} />
      </Col>
      <Col>
        <RoundCardList courseId={courseId} playerId={playerId} />
      </Col>
    </Row>
  </Layout>
);

const getStaticProps: ServerSideProps = async ({ params }) => {
  const { courseSlug, playerSlug } = params;
  const { coursePlayers } = await graphqlClient.request(
    CoursePlayerPageDocument,
    { courseSlug, playerSlug },
  );

  return {
    props: {
      coursePlayer: coursePlayers[0],
    },
  };
};

const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
  const { coursePlayers } = await graphqlClient.request(CoursePlayerStaticListingDocument);

  return {
    paths: coursePlayers.map(
      ({ course, player }) => ({
        params: {
          courseSlug: course.slug,
          playerSlug: player.slug,
        },
      }),
    ),
    fallback: false,
  };
};

export {
  getStaticProps,
  getStaticPaths,
  CoursePlayerPage as default,
};
