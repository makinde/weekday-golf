import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { Row, Col, Button } from 'react-bootstrap';

import sdk from '../../sdk';
import Layout from '../../components/utils/Layout';
import Avatar from '../../components/utils/Avatar';
import PageHeader from '../../components/utils/PageHeader';
import CardHeaderTitle from '../../components/utils/CardHeaderTitle';
import RoundCard from '../../components/visualization/RoundCard';
import LeaderboardCard from '../../components/visualization/LeaderboardCard';
import ParticipationStatsCard from '../../components/visualization/ParticipationStatsCard';

import { InfoForIndexPageQuery } from '../../types';
import ScoringStatsCard from '../../components/visualization/ScoringStatsCard';

const OverviewPage: NextPage<InfoForIndexPageQuery> = ({
  course,
  latestRounds,
  leaderboardPlayerRounds,
  playersWithScoringStats,
  playersWithParticipationStats,
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
        <LeaderboardCard playerRounds={leaderboardPlayerRounds} />
      </Col>
      <Col xs={12}>
        <ParticipationStatsCard players={playersWithParticipationStats} />
      </Col>
      <Col xs={12}>
        <ScoringStatsCard players={playersWithScoringStats} holes={course.holes} />
      </Col>
    </Row>

  </Layout>
);

type PageQuery = { courseSlug: string };
type StaticProps = GetStaticProps<InfoForIndexPageQuery, PageQuery>;

const getStaticProps: StaticProps = async ({ params }) => {
  const { courseSlug: slug } = params;
  const { courses } = await sdk.courseForIndexPageSlug({ slug });
  const [{ id: courseId }] = courses;

  return {
    props: await sdk.infoForIndexPage({ courseId }),
  };
};

const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
  const { courses } = await sdk.coursesForIndexPagePaths();

  return {
    paths: courses.map((course) => ({ params: { courseSlug: course.slug } })),
    fallback: false,
  };
};

export {
  getStaticProps,
  getStaticPaths,
  OverviewPage as default,
};
