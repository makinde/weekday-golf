import React, { useRef } from 'react';
import {
  Button, Card, Row, Col, CardProps,
} from 'react-bootstrap';
import map from 'lodash/map';
import html2canvas from 'html2canvas';

import Link from 'next/link';
import { RoundForRoundCard } from '../../apiHooks';
import RoundTable from './RoundTable';
import RoundTitle from '../utils/RoundTitle';
import CardHeaderTitle from '../utils/CardHeaderTitle';
import CompactDate from '../utils/CompactDate';

const BREATHING_ROOM = 50;

type Props = CardProps & {
  round: RoundForRoundCard,
  title?: React.ReactNode,
  canEdit?: boolean,
};

const RoundCard = ({
  round, title, canEdit = true, ...rest
}: Props) => {
  const cardRef = useRef(null);

  return (
    <Card id={`round-${round.id}`} {...rest} ref={cardRef}>
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
          <Card.Body className="border-top">
            <Row>
              <Col className="small text-muted">
                {/* Hidden dependency. html2canvas won't work [well] if the content shifts
                  when a screenshot is taken. So always display 2 lines of text so that
                  even when the buttons are hidden, the card stays the same height. */}
                <div>
                  $
                  {round.skinsHoleBounty || 0}
                  {' '}
                  hole skin
                </div>

                <div>
                  $
                  {round.roundBounty || 0}
                  {' '}
                  round winner
                </div>

              </Col>
              <Col xs="auto" data-html2canvas-ignore>
                {canEdit && (
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
                    <Button variant="white" size="sm" className="mr-3">
                      <i className="fe fe-edit mr-2" />
                      Edit
                    </Button>
                  </Link>
                )}
                <Button
                  variant="white"
                  size="sm"
                  onClick={async () => {
                    // The new window must be opened before any async actions
                    const imgWindow = window.open();

                    // The screen grab only works when scrolled to the top
                    // See: https://stackoverflow.com/questions/40349075/html2canvas-image-is-getting-cut
                    const scrX = window.scrollX;
                    const scrY = window.scrollY;
                    window.scrollTo(0, 0);

                    const cardElement = cardRef.current;
                    const canvasElement = await html2canvas(cardElement, {
                      windowWidth: window.innerWidth + BREATHING_ROOM,
                      width: cardElement.offsetWidth + BREATHING_ROOM,
                    });

                    imgWindow.document.body.innerHTML = `<img src="${canvasElement.toDataURL()}">`;
                    window.scrollTo(scrX, scrY);
                  }}
                >
                  <i className="fe fe-share mr-2" />
                  Share
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </>
      )}
    </Card>
  );
};

export default RoundCard;
