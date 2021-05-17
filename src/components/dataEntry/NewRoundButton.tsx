import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button, ButtonProps, Modal, Card, Row, Col, InputGroup, FormControl,
} from 'react-bootstrap';
import { format } from 'date-fns';

import CardHeaderTitle from '../utils/CardHeaderTitle';
import PlayerSelector from './PlayerSelector';
import { useNewRoundButtonInsert } from '../../apiHooks';

const DEFAULT_BOUNTY = 10;

type Props = ButtonProps & React.PropsWithChildren<{
  courseId: number,
}>;

const NewRoundButton = ({ courseId, children, ...rest }: Props) => {
  const { push } = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playerIds, setPlayerIds] = useState([]);
  const [skinsHoleBounty, setSkinsHoleBounty] = useState(DEFAULT_BOUNTY);
  const [roundBounty, setRoundBounty] = useState(DEFAULT_BOUNTY);
  const onHide = () => setShowModal(false);

  const { mutateAsync } = useNewRoundButtonInsert();

  const createRound = async () => {
    setLoading(true);
    const date = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss');
    const { insertRound } = await mutateAsync({
      courseId,
      date,
      skinsHoleBounty,
      skinsPlayerIds: skinsHoleBounty ? playerIds : [],
      roundBounty,
      roundBountyPlayerIds: roundBounty ? playerIds : [],
    });
    const { roundId, course } = insertRound;

    push({
      pathname: '/[courseSlug]/scorecard',
      query: {
        courseSlug: course.slug,
        roundId,
        actives: playerIds,
      },
    });
  };

  return (
    <>
      <Button
        {...rest}
        disabled={loading ? true : rest.disabled}
        onClick={() => setShowModal(true)}
      >
        {children}
      </Button>
      <Modal centered show={showModal} onHide={onHide}>
        <div className="modal-card">
          <Card.Header>
            <CardHeaderTitle>
              New Round
            </CardHeaderTitle>
            <Button className="close" onClick={onHide} aria-label="Close">
              <span aria-hidden="true">×</span>
            </Button>
          </Card.Header>
          <Modal.Body>
            <Row>
              <Col>
                <h3 className="d-inline-block">Skins</h3>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="number"
                    step={1}
                    value={skinsHoleBounty || 0}
                    onChange={({ target: t }) => setSkinsHoleBounty(parseInt(t.value, 10) || null)}
                    aria-label="Per Hole Skins Bounty"
                  />
                </InputGroup>
              </Col>
              <Col>
                <h3 className="d-inline-block">Round Bounty</h3>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="number"
                    step={1}
                    value={roundBounty || 0}
                    onChange={(event) => setRoundBounty(parseInt(event.target.value, 10) || null)}
                    aria-label="Round Bounty"
                  />
                </InputGroup>
              </Col>
            </Row>
            <PlayerSelector
              playerIds={playerIds}
              setPlayerIds={setPlayerIds}
              id="newRoundButtonPlayerSelector"
            />
          </Modal.Body>
          <Card.Footer>
            <Button
              block
              variant="primary"
              className="ml-auto"
              onClick={createRound}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : 'Create'}
            </Button>
          </Card.Footer>
        </div>
      </Modal>
    </>
  );
};

export default NewRoundButton;
