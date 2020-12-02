import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { Row, Col, Card } from 'react-bootstrap';

import sdk from '../sdk';
import Layout from '../components/utils/Layout';
import Leaderboard from '../components/visualization/Leaderboard';
import RoundSummary from '../components/visualization/RoundsSummary';
import { OverviewPageQuery } from '../types';

const OverviewPage: NextPage<OverviewPageQuery> = ({
  summaryRounds,
  leaderboardEntries,
}) => (
  <Layout title="Overview">
    <Row>
      <Col>
        <RoundSummary rounds={summaryRounds} />
      </Col>

      <Col sm={4}>
        <Card>
          <Card.Header>Top Rounds</Card.Header>
          <Card.Body>
            <Leaderboard entries={leaderboardEntries} />
          </Card.Body>
        </Card>
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
