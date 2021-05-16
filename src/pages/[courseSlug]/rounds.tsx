import React from 'react';
import { GetStaticProps } from 'next';
import { Row, Col } from 'react-bootstrap';

import { getStaticPaths } from './index';
import graphqlClient from '../../graphqlClient';
import { CourseRoundsPageDocument, CourseForRoundsPage } from '../../apiHooks';
import Layout, { CoursePage } from '../../components/utils/Layout';
import LeaderboardCard from '../../components/card/LeaderboardCard';
import RoundCardList from '../../components/card/RoundCardList';
import PageHeader from '../../components/utils/PageHeader';

type PageQuery = { courseSlug: string };
type Props = { course: CourseForRoundsPage };
type StaticProps = GetStaticProps<Props, PageQuery>;

const CourseRoundsPage = ({ course }: Props) => (
  <Layout
    title={`${course.name} Rounds`}
    focusedCourseId={course.id}
    focusedCoursePage={CoursePage.Rounds}
  >
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
        <LeaderboardCard courseId={course.id} />
      </Col>
      <Col md={7}>
        <RoundCardList courseId={course.id} />
      </Col>
    </Row>
  </Layout>
);

const getStaticProps: StaticProps = async ({ params }) => {
  const { courseSlug: slug } = params;
  const { courses } = await graphqlClient.request(CourseRoundsPageDocument, { slug });

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
