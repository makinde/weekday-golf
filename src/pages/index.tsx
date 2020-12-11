import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { Row, Col } from 'react-bootstrap';

import sdk from '../sdk';
import Layout from '../components/utils/Layout';
import LeaderboardCard from '../components/visualization/LeaderboardCard';
import RoundCard from '../components/visualization/RoundCard';
import CardHeaderTitle from '../components/utils/CardHeaderTitle';
import { OverviewPageQuery } from '../types';

const OverviewPage: NextPage<OverviewPageQuery> = ({
  latestRounds,
  leaderboardPlayerRounds,
}) => (
  <Layout title="Overview">
    <div className="header">
      <div className="header-body">
        <Row className="align-items-center">
          <Col>
            <h6 className="header-pretitle">
              Courses
            </h6>
            <h1 className="header-title">
              Mariners Point
            </h1>
          </Col>
          <Col className="col-auto">
            <a href="#" className="btn btn-primary">
              New Round
            </a>
          </Col>
        </Row>
      </div>
    </div>
    <Row>
      <Col>
        <RoundCard
          round={latestRounds[0]}
          title={(
            <CardHeaderTitle>
              Latest Round
              <Link href="/rounds">
                <a className="small ml-3">
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
    </Row>

  </Layout>
);

const getStaticProps: GetStaticProps<OverviewPageQuery> = async () => {
  const props = await sdk.overviewPage({ courseId: 1 });

  return {
    props,
  };
};

export {
  getStaticProps,
  OverviewPage as default,
};
