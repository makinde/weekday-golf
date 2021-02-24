import React from 'react';
import {
  Button, Card, Modal, ModalProps,
} from 'react-bootstrap';
import without from 'lodash/without';

import CardHeaderTitle from '../utils/CardHeaderTitle';
import sdk, { useSdk } from '../../sdk';

type Props = ModalProps & {
  playerIds: number[],
  setPlayerIds: (playerIds: number[]) => void,
};

const PlayerSelectorModal = ({
  playerIds,
  setPlayerIds,
  onHide,
  ...rest
}: Props) => {
  const { data } = useSdk(sdk.playerSelectModal, {});
  const { players = [] } = data ?? {};

  return (
    <Modal centered onHide={onHide} {...rest}>
      <div className="modal-card">
        <Card.Header>
          <CardHeaderTitle>
            Select Players
          </CardHeaderTitle>
          <Button className="close" onClick={onHide} aria-label="Close">
            <span aria-hidden="true">×</span>
          </Button>
        </Card.Header>
        <Modal.Body>
          {players.map(({ id, fullName }) => (
            <div key={id} className="custom-control custom-checkbox checklist-control">
              <input
                className="custom-control-input"
                id={`checklist-${id}`}
                type="checkbox"
                checked={playerIds.includes(id)}
                onChange={(event) => {
                  setPlayerIds(
                    event.target.checked
                      ? [...playerIds, id]
                      : without(playerIds, id),
                  );
                }}
              />
              <label className="custom-control-label" htmlFor={`checklist-${id}`} />
              <span>
                {fullName}
              </span>
            </div>
          ))}
        </Modal.Body>
        <Card.Footer>
          <Button variant="primary" onClick={onHide}>
            Done
          </Button>
        </Card.Footer>
      </div>
    </Modal>
  );
};

export default PlayerSelectorModal;
