import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

import { RoundForSummaryFragment } from '../../types';
import RoundTable from './RoundTable';
import RoundTitle from '../utils/RoundTitle';

type Props = {
  rounds: RoundForSummaryFragment[],
};

const RoundsSummary = ({ rounds }: Props) => (
  <Accordion defaultActiveKey={`${rounds[0].id}`}>
    <Card>
      <Card.Header>
        Recent Rounds
      </Card.Header>
    </Card>
    {rounds.map((round) => (
      <Card body key={round.id}>
        <Accordion.Toggle as="h5" className="mb-0" eventKey={`${round.id}`}>
          <RoundTitle name={round.name} date={round.date} />
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={`${round.id}`}>
          <RoundTable round={round} />
        </Accordion.Collapse>
      </Card>
    ))}
  </Accordion>
);

export default RoundsSummary;
