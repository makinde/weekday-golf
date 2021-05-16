import React, { useState } from 'react';
import {
  Button, Card, FormControl, Modal, InputGroup, Row, Col,
} from 'react-bootstrap';
import { useQueryClient } from 'react-query';

import CardHeaderTitle from '../utils/CardHeaderTitle';
import CompactDate from '../utils/CompactDate';
import { MultiPlayerSelectorButton, SinglePlayerSelectorButton } from './PlayerSelector';
import {
  UpdateScorecardRound,
  useScorecardRoundInfo,
  useUpdateScorecardRound,
  RoundForScorecard,
  CourseForScorecardRoundInfo,
} from '../../apiHooks';

type Props = {
  course: CourseForScorecardRoundInfo,
  roundId: number,
};

const ScorecardRoundInfo = ({ course, roundId }: Props) => {
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();
  const queryKey = useScorecardRoundInfo.getKey({ roundId });

  const { data } = useScorecardRoundInfo({ roundId });
  const { mutate } = useUpdateScorecardRound<unknown, {previousRoundData: UpdateScorecardRound}>({
    onMutate: async (mutationData) => {
      await queryClient.cancelQueries(queryKey);
      const previousRoundData = queryClient.getQueryData<UpdateScorecardRound>(queryKey);
      queryClient.setQueryData(queryKey, {
        round: {
          ...previousRoundData.round,
          ...mutationData.roundUpdate,
        },
      });

      return { previousRoundData };
    },
    onError: (err, mutationData, context) => {
      queryClient.setQueryData(queryKey, context.previousRoundData);
    },
  });

  const onHide = () => setEditing(false);
  const mutateField = (fieldName: keyof RoundForScorecard, value: any) => mutate({
    roundId,
    roundUpdate: { [fieldName]: value || null },
  });

  const {
    name = null,
    date = new Date().toISOString(),
    skinsHoleBounty = null,
    skinsPlayerIds = [],
    skinsTiebreakWinnerId = null,
    roundBounty = null,
    roundBountyPlayerIds = [],
    roundBountyTiebreakWinnerId = null,
  } = data?.round ?? {};

  return (
    <>
      <div className="d-flex mx-n3 mx-md-n5 p-3 bg-light border-bottom">
        <div>
          {!!name && (
            <strong>
              {name}
            </strong>
          )}
          <div>
            <CompactDate date={date} />
          </div>
          <div>
            {course?.name}
          </div>
        </div>
        <div className="ml-auto">
          <Button variant="link" className="text-reset" onClick={() => setEditing(true)}>
            <i className="fe fe-edit" />
          </Button>
        </div>
      </div>
      <Modal centered show={editing} onHide={onHide}>
        <div className="modal-card">
          <Card.Header>
            <CardHeaderTitle>
              Round Edit
            </CardHeaderTitle>
            <Button className="close" onClick={onHide} aria-label="Close">
              <span aria-hidden="true">×</span>
            </Button>
          </Card.Header>
          <Modal.Body>
            <FormControl
              className="mb-3"
              type="datetime-local"
              aria-label="Date & Time"
              value={date}
              onChange={(event) => mutateField('date', event.target.value)}
              required
            />
            <FormControl
              placeholder="Round Name"
              aria-label="Round Name"
              value={name || ''}
              onChange={(event) => mutateField('name', event.target.value)}
            />
            <br />
            Skins
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="number"
                    step={1}
                    value={skinsHoleBounty || 0}
                    onChange={(event) => mutateField(
                      'skinsHoleBounty',
                      parseInt(event.target.value, 10) || null,
                    )}
                    placeholder="Skins Bounty"
                    aria-label="Per Hole Skins Bounty"
                  />
                </InputGroup>
              </Col>
              <Col>
                <MultiPlayerSelectorButton
                  playerIds={skinsPlayerIds}
                  setPlayerIds={(playerIds) => mutateField('skinsPlayerIds', playerIds)}
                  id="skinsParticipants"
                  variant="outline-secondary"
                  block
                />
              </Col>
            </Row>
            <SinglePlayerSelectorButton
              playerId={skinsTiebreakWinnerId}
              setPlayerId={(playerId) => mutateField('skinsTiebreakWinnerId', playerId)}
              id="skinsTiebreakWinner"
              variant="outline-secondary"
              block
            />
            <br />
            Round Bounty
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="number"
                    step={1}
                    value={roundBounty || 0}
                    onChange={(event) => mutateField(
                      'roundBounty',
                      parseInt(event.target.value, 10) || null,
                    )}
                    placeholder="Round Bounty"
                    aria-label="Round Bounty"
                  />
                </InputGroup>
              </Col>
              <Col>
                <MultiPlayerSelectorButton
                  playerIds={roundBountyPlayerIds}
                  setPlayerIds={(playerIds) => mutateField('roundBountyPlayerIds', playerIds)}
                  id="roundBountyParticipants"
                  variant="outline-secondary"
                  block
                />
              </Col>
            </Row>
            <SinglePlayerSelectorButton
              playerId={roundBountyTiebreakWinnerId}
              setPlayerId={(playerId) => mutateField('roundBountyTiebreakWinnerId', playerId)}
              id="roundBountyTiebreakWinner"
              variant="outline-secondary"
              block
            />
          </Modal.Body>
          <Card.Footer>
            <Button
              block
              variant="primary"
              className="ml-auto"
              onClick={onHide}
            >
              Done
            </Button>
          </Card.Footer>
        </div>
      </Modal>
    </>
  );
};
export default ScorecardRoundInfo;
