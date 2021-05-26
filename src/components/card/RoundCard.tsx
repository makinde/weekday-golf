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

async function shareRoundCard(cardElement) {
  // Phew, opening the share sheet on mobile (or desktop for that matter)
  // with an attached image is HELL right now. The API needed is the Web Share
  // API. Level 1 (supported in 50% of browsers), only allows text to be shared.
  // Level 2 allows images. Basically nothing on apple hardware supports the
  // latter, and the spec is finalized (so vs code shows an error when you try
  // to do level 2 stuff). This tries to sniff capabilities as much as possible
  // to show the share sheet or open an image in a new tab so the person can share
  // it manually.
  // See: https://web.dev/web-share/
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share

  // We first have to try to detect if files can be shared right away since
  // safari won't let us open the new tab after an async operation.
  // @ts-ignore
  const useWebShare = navigator.canShare && navigator.canShare({ files: [] });
  let windowReference: Window;
  if (!useWebShare) {
    windowReference = window.open();
  }

  const canvasElement = await html2canvas(cardElement, {
    scrollY: 0,
    windowWidth: window.innerWidth + BREATHING_ROOM,
    width: cardElement.offsetWidth + BREATHING_ROOM,
  });
  const dataUrl = canvasElement.toDataURL();

  if (!useWebShare) {
    windowReference.document.body.innerHTML = `<img src="${dataUrl}">`;
    return;
  }

  // Okay, we should be able to share files.
  const blob = await (await fetch(dataUrl)).blob();
  const filesArray = [
    new File(
      [blob],
      'scorecard.png',
      {
        type: blob.type,
        lastModified: new Date().getTime(),
      },
    ),
  ];

  // @ts-ignore
  if (navigator.canShare && navigator.canShare({ files: filesArray })) {
    try {
      await navigator.share({
        // @ts-ignore
        files: filesArray,
        title: 'This week\'s scores',
      });
    } catch (err) {
      // Just ignore :(
    }
  } else {
    // FUUUUU. It's too late to open a new window now, so we can't fall back
    // to the old method. Just bail.
  }
}

type Props = CardProps & {
  round: RoundForRoundCard,
  title?: React.ReactNode,
  canEdit?: boolean,
  canShare?: boolean,
};

const RoundCard = ({
  round, title, canEdit = true, canShare = false, ...rest
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
          {(round.skinsHoleBounty || round.roundBounty || canEdit || true) && (
            <Card.Body className="border-top">
              <Row>
                <Col className="small text-muted">
                  {round.skinsHoleBounty && (
                    <div>
                      $
                      {round.skinsHoleBounty}
                      /hole skin
                    </div>
                  )}
                  {round.roundBounty && (
                    <div>
                      $
                      {round.roundBounty}
                      {' '}
                      round winner
                    </div>
                  )}
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
                  {canShare && (
                    <Button variant="white" size="sm" onClick={() => shareRoundCard(cardRef.current)}>
                      <i className="fe fe-share mr-2" />
                      Share
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          )}
        </>
      )}
    </Card>
  );
};

export default RoundCard;
