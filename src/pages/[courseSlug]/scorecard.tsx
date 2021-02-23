import React from 'react';
import {
  ToggleButtonGroup, ToggleButton,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import find from 'lodash/find';
import castArray from 'lodash/castArray';
import toInteger from 'lodash/toInteger';
import { GetStaticProps } from 'next';

import { getStaticPaths } from './index';
import Layout from '../../components/utils/Layout';
import sdk from '../../sdk';
import ScorecardRoundInfo from '../../components/dataEntry/ScorecardRoundInfo';
import ScorecardPlayerList from '../../components/dataEntry/ScorecardPlayerList';
import { ScorecardPageNew } from '../../types';

type PageQuery = { courseSlug: string };
type Props = { course: ScorecardPageNew['courses'][0] };
type StaticProps = GetStaticProps<Props, PageQuery>;

const ScorecardPage = ({ course }: Props) => {
  const { query, replace } = useRouter();

  const { slug: courseSlug, holes } = course;

  const roundId = toInteger(query.roundId);
  const activePlayerIds = castArray(query.actives).filter((p) => !!p).map(toInteger);
  const activeHoleNumber = toInteger(query.hole) || 1;
  const activeHole = find(holes, { number: activeHoleNumber });

  return (
    <Layout title="Overview">
      <ScorecardRoundInfo />
      <div className="d-flex mx-n3 mx-md-n5 p-3 bg-light">
        <span>
          Hole&nbsp;
          <span className="h1">{activeHoleNumber}</span>
        </span>
        <span className="ml-auto">
          Par&nbsp;
          <span className="h1">{activeHole?.par ?? '-'}</span>
        </span>
      </div>
      {roundId && (
        <ScorecardPlayerList
          playerIds={activePlayerIds}
          roundId={roundId}
          course={course}
          holeNumber={activeHoleNumber}
        />
      )}
      <ToggleButtonGroup
        name="hole_selector"
        type="radio"
        value={activeHoleNumber}
        onChange={(value) => replace({
          pathname: '/[courseSlug]/scorecard',
          query: {
            courseSlug,
            roundId,
            actives: activePlayerIds,
            hole: value,
          },
        }, undefined, { shallow: true })}
      >
        {holes.map((hole) => (
          <ToggleButton key={hole.number} value={hole.number} variant="secondary">
            {hole.number}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Layout>
  );
};

const getStaticProps: StaticProps = async ({ params }) => {
  const { courseSlug: slug } = params;
  const { courses: [course] } = await sdk.scorecardPageNEW({ slug });

  return {
    props: { course },
    revalidate: 60,
  };
};

export {
  getStaticProps,
  getStaticPaths,
  ScorecardPage as default,
};
