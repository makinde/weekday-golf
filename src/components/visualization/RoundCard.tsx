/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Card } from 'react-bootstrap';

import { RoundForRoundCardFragment } from '../../types';
import RoundTable from './RoundTable';
import RoundTitle from '../utils/RoundTitle';
import CardHeaderTitle from '../utils/CardHeaderTitle';

type Props = {
  round: RoundForRoundCardFragment,
  title?: React.ReactNode,
};

const RoundCard = ({ round, title }: Props) => (
  <Card>
    <Card.Header>
      {title || (
        <CardHeaderTitle>
          <RoundTitle name={round.name} date={round.date} />
        </CardHeaderTitle>
      )}

      <time className="small text-muted" dateTime="2019-06-09">
        <i className="fe fe-clock mr-1" />
        Jun 9
      </time>
    </Card.Header>
    <RoundTable round={round} className="table-nowrap card-table border-bottom" />
    <Card.Body>
      <div className="small text-muted">
        {round.skinsHoleBounty && (
        <span>
          $
          {round.skinsHoleBounty}
          /hole skin
          {round.roundBounty && ','}
        </span>
        )}
        {round.roundBounty && (
          `$${round.roundBounty} round winner`
        )}
      </div>
    </Card.Body>
  </Card>
);

export default RoundCard;
