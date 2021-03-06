import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Row, Col } from 'react-bootstrap';

import graphqlClient from '../../graphqlClient';
import {
  CourseIndexPageDocument,
  CourseForIndexPage,
  CourseSlugStaticListingDocument,
} from '../../apiHooks';
import Layout, { CoursePage } from '../../components/utils/Layout';
import Avatar from '../../components/utils/Avatar';
import PageHeader from '../../components/utils/PageHeader';
import RoundCardList from '../../components/card/RoundCardList';
import LeaderboardCard from '../../components/card/LeaderboardCard';
import ParticipationStatsCard from '../../components/card/ParticipationStatsCard';
import ScoringStatsCard from '../../components/card/ScoringStatsCard';
import RoundsPlayedStatCard from '../../components/card/statCard/RoundsPlayedStatCard';
import ScoreCountStatCard from '../../components/card/statCard/ScoreCountStatCard';

import AverageScoreStatCard from '../../components/card/statCard/AverageScoreStatCard';
import NewRoundButton from '../../components/dataEntry/NewRoundButton';

type PageQuery = { courseSlug: string };
type ServerSideProps = GetStaticProps<Props, PageQuery>;
type Props = { course: CourseForIndexPage };

const CourseIndexPage = ({ course }: Props) => (
  <Layout
    title="Overview"
    focusedCourseId={course.id}
    focusedCoursePage={CoursePage.Overview}
  >
    <PageHeader>
      <Row className="align-items-center">
        {!!course.img && (
          <Col xs="auto">
            <Avatar src={course.img} size="lg" shape="rounded" />
          </Col>
        )}
        <Col>
          <PageHeader.PreTitle>{course.name}</PageHeader.PreTitle>
          <PageHeader.Title>Overview</PageHeader.Title>
        </Col>
        <Col xs="auto">
          <NewRoundButton courseId={course.id} variant="primary">
            + New Round
          </NewRoundButton>
        </Col>
      </Row>
    </PageHeader>
    <Row>
      <Col>
        <RoundCardList courseId={course.id} limit={1} />
      </Col>
      <Col sm={4}>
        <RoundsPlayedStatCard courseId={course.id} />
        <AverageScoreStatCard courseId={course.id} />
        <ScoreCountStatCard courseId={course.id} />
      </Col>
      <Col sm={8}>
        <ParticipationStatsCard courseId={course.id} />
      </Col>
      <Col sm={4}>
        <LeaderboardCard courseId={course.id} />
      </Col>
      <Col>
        <ScoringStatsCard courseId={course.id} />
      </Col>
    </Row>

  </Layout>
);

const getStaticProps: ServerSideProps = async ({ params }) => {
  const { courseSlug: slug } = params;
  const { courses } = await graphqlClient.request(CourseIndexPageDocument, { slug });

  return {
    props: {
      course: courses[0],
    },
  };
};

const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
  const { courses } = await graphqlClient.request(CourseSlugStaticListingDocument);

  return {
    paths: courses.map(({ slug }) => ({ params: { courseSlug: slug } })),
    fallback: false,
  };
};

export {
  getStaticProps,
  getStaticPaths,
  CourseIndexPage as default,
};
