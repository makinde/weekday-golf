import React from 'react';
import { parseISO, format } from 'date-fns';
import {
  Accordion, Card,
} from 'react-bootstrap';

import { RoundForSummaryFragment } from '../../types';
import RoundTable from './RoundTable';

type Props = {
  rounds: RoundForSummaryFragment[],
};

const RoundsSummary = ({ rounds }: Props) => (
  <Accordion defaultActiveKey={`${rounds[0].id}`}>
    {rounds.map((round) => (
      <Card body key={round.id}>
        <Accordion.Toggle as="h3" eventKey={`${round.id}`}>
          {!!round.name && round.name}
          {!round.name && format(parseISO(round.date), 'EEEE MMM do, y')}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={`${round.id}`}>
          <RoundTable round={round} />

        </Accordion.Collapse>
      </Card>
    ))}
  </Accordion>
);

export default RoundsSummary;
