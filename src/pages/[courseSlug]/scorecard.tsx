import React, { useState } from 'react';
import {
  ToggleButtonGroup, ToggleButton, Button, Modal, Card,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import find from 'lodash/find';
import castArray from 'lodash/castArray';
import toInteger from 'lodash/toInteger';
import { GetStaticProps } from 'next';

import graphqlClient from '../../graphqlClient';
import { getStaticPaths } from './index';
import Layout from '../../components/utils/Layout';
import ScorecardRoundInfo from '../../components/dataEntry/ScorecardRoundInfo';
import ScorecardPlayerList from '../../components/dataEntry/ScorecardPlayerList';
import PlayerSelector from '../../components/dataEntry/PlayerSelector';
import CardHeaderTitle from '../../components/utils/CardHeaderTitle';
import { ScorecardPageNewDocument, ScorecardPageNew } from '../../apiHooks';

type PageQuery = { courseSlug: string };
type Props = { course: ScorecardPageNew['courses'][0] };
type StaticProps = GetStaticProps<Props, PageQuery>;

const ScorecardPage = ({ course }: Props) => {
  const { query, pathname, replace } = useRouter();

  const { holes } = course;

  const roundId = toInteger(query.roundId);
  const activePlayerIds = castArray(query.actives).filter((p) => !!p).map(toInteger);
  const activeHoleNumber = toInteger(query.hole) || 1;
  const activeHole = find(holes, { number: activeHoleNumber });
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);

  return (
    <Layout title="Overview">
      <ScorecardRoundInfo course={course} roundId={roundId} />
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
      <Button
        block
        onClick={() => setShowPlayerSelector(true)}
        variant="light"
        className="my-3"
      >
        Edit Players
      </Button>
      <Modal
        centered
        onHide={() => setShowPlayerSelector(false)}
        show={showPlayerSelector}
      >
        <div className="modal-card">
          <Card.Header>
            <CardHeaderTitle>
              Select Players
            </CardHeaderTitle>
            <Button className="close" onClick={() => setShowPlayerSelector(false)} aria-label="Close">
              <span aria-hidden="true">×</span>
            </Button>
          </Card.Header>
          <Modal.Body>
            <PlayerSelector
              playerIds={activePlayerIds}
              setPlayerIds={(newPlayerIds) => replace({
                pathname,
                query: { ...query, actives: newPlayerIds },
              }, undefined, { shallow: true })}
              id="scorecardPlayerSelector"
            />
          </Modal.Body>
          <Card.Footer>
            <Button variant="primary" onClick={() => setShowPlayerSelector(false)}>
              Done
            </Button>
          </Card.Footer>
        </div>
      </Modal>
      <ToggleButtonGroup
        name="hole_selector"
        type="radio"
        value={activeHoleNumber}
        onChange={(value) => replace({
          pathname,
          query: { ...query, hole: value },
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
  const { courses: [course] } = await graphqlClient.request(ScorecardPageNewDocument, { slug });

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
