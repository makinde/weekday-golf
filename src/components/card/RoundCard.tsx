import React from 'react';
import { Card } from 'react-bootstrap';

import { RoundForRoundCardFragment } from '../../types';
import RoundTable from './RoundTable';
import RoundTitle from '../utils/RoundTitle';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import CompactDate from '../utils/CompactDate';

type Props = {
  round: RoundForRoundCardFragment,
  title?: React.ReactNode,
};

const RoundCard = ({ round, title }: Props) => (
  <Card>
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
        {(round.skinsHoleBounty || round.roundBounty) && (
          <Card.Body className="border-top">
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
        )}
      </>
    )}
  </Card>
);

export default RoundCard;
