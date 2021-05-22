import React from 'react';
import {
  Button, Card, Row, Col,
} from 'react-bootstrap';
import map from 'lodash/map';

import Link from 'next/link';
import { RoundForRoundCard } from '../../apiHooks';
import RoundTable from './RoundTable';
import RoundTitle from '../utils/RoundTitle';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import CompactDate from '../utils/CompactDate';

type Props = {
  round: RoundForRoundCard,
  title?: React.ReactNode,
};

// Replace this with a permissions check when login becomes a thing
const canEdit = true;

const RoundCard = ({ round, title }: Props) => (
  <Card id={`round-${round.id}`}>
    {!round && (
      <Card.Body>No round yet</Card.Body>
    )}
    {round && (
      <>
        <Card.Header>
          {title || (
            <CardHeaderTitle>
              <RoundTitle name={round.name} date={round.date} />
            </CardHeaderTitle>
          )}
          <Card.Text className="small text-muted">
            <i className="fe fe-clock mr-1" />
            <CompactDate date={round.date} dateFormat="MMM d" yearFormat=" ''yy" />
          </Card.Text>
        </Card.Header>
        <RoundTable round={round} className="table-nowrap card-table" />
        {(round.skinsHoleBounty || round.roundBounty || canEdit) && (
          <Card.Body className="border-top">
            <Row>
              <Col className="small text-muted">
                {round.skinsHoleBounty && (
                <span>
                  $
                  {round.skinsHoleBounty}
                  /hole skin
                  {round.roundBounty && (<>,&nbsp;</>)}
                </span>
                )}
                {round.roundBounty && (
                  `$${round.roundBounty} round winner`
                )}
              </Col>
              <Col xs="auto">
                <Link
                  href={{
                    pathname: '/[courseSlug]/scorecard/',
                    query: {
                      courseSlug: round.course.slug,
                      roundId: round.id,
                      actives: map(round.playerRounds, 'player.id'),
                    },
                  }}
                  passHref
                >
                  <Button variant="white" size="sm">
                    <i className="fe fe-edit mr-2" />
                    Edit Scores
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card.Body>
        )}
      </>
    )}
  </Card>
);

export default RoundCard;
