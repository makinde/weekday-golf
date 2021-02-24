import React, { useState } from 'react';
import useSWR from 'swr';
import {
  Button, Card, Modal, ModalProps,
} from 'react-bootstrap';

import CardHeaderTitle from '../utils/CardHeaderTitle';
import sdk from '../../sdk';

type Props = ModalProps & {
  roundId: number,
};

const RoundEditModal = ({ roundId, onHide, ...rest }: Props) => {
  const { data, mutate } = useSWR(
    ['RoundEditModal', roundId],
    () => {}, // () => sdk.roundEditModal({ roundId }),
  );

  return (
    <Modal centered onHide={onHide} {...rest}>
      <div className="modal-card">
        <Card.Header>
          <CardHeaderTitle>
            Round Edit
          </CardHeaderTitle>
          <Button className="close" onClick={onHide} aria-label="Close">
            <span aria-hidden="true">×</span>
          </Button>
        </Card.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Card.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onHide}>
            Done
          </Button>
        </Card.Footer>
      </div>
    </Modal>
  );
};

export default RoundEditModal;
