import React from 'react';
import {
  NextPage, GetServerSideProps,
} from 'next';
import Link from 'next/link';
import { Row, Col, Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';

import sdk from '../../sdk';
import Layout from '../../components/utils/Layout';
import Avatar from '../../components/utils/Avatar';
import PageHeader from '../../components/utils/PageHeader';
import CardHeaderTitle from '../../components/utils/CardHeaderTitle';
import RoundCard from '../../components/visualization/RoundCard';
import LeaderboardCard from '../../components/visualization/LeaderboardCard';
import ParticipationStatsCard from '../../components/visualization/ParticipationStatsCard';
import ScoringStatsCard from '../../components/visualization/ScoringStatsCard';
import RoundsPlayedStatCard from '../../components/visualization/statCards/RoundsPlayedStatCard';
import ScoreCountStatCard from '../../components/visualization/statCards/ScoreCountStatCard';

import { CourseIndexPageQuery } from '../../types';
import AverageScoreStatCard from '../../components/visualization/statCards/AverageScoreStatCard';

type Props = {
  course:CourseIndexPageQuery['courses'][0]
};

const CourseIndexPage: NextPage<Props> = ({
  course,
  course: {
    latestRounds,
    coursePlayers,
  },
}) => (
  <Layout title="Overview">
    <PageHeader>
      <Row className="align-items-center">
        {!!course.img && (
          <Col xs="auto">
            <Avatar src={course.img} size="lg" shape="rounded" />
          </Col>
        )}
        <Col>
          <PageHeader.PreTitle>Courses</PageHeader.PreTitle>
          <PageHeader.Title>{course.name}</PageHeader.Title>
        </Col>
        <Col xs="auto">
          <Button variant="primary" href="#">
            New Round
          </Button>
        </Col>
      </Row>
    </PageHeader>
    <Row>
      <Col>
        <RoundCard
          round={latestRounds[0]}
          title={(
            <CardHeaderTitle>
              Latest Round
              <Link href="/rounds">
                <a className="small ml-3 text-primary">
                  See all
                </a>
              </Link>
            </CardHeaderTitle>
          )}
        />
      </Col>
      <Col sm={4}>
        <RoundsPlayedStatCard courseId={course.id} />
        <AverageScoreStatCard courseId={course.id} />
        <ScoreCountStatCard courseId={course.id} />
      </Col>
      <Col sm={8}>
        <ParticipationStatsCard coursePlayers={coursePlayers} />
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

type PageQuery = { courseSlug: string };
type ServerSideProps = GetServerSideProps<Props, PageQuery>;

const getServerSideProps: ServerSideProps = async ({ params }) => {
  const { courseSlug: slug } = params;
  const { courses } = await sdk.courseIndexPage({ slug });

  if (isEmpty(courses)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      course: courses[0],
    },
  };
};

export {
  getServerSideProps,
  CourseIndexPage as default,
};
