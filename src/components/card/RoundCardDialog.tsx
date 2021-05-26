import React from 'react';
import { Modal } from 'react-bootstrap';

import RoundCard from './RoundCard';
import { useRoundCardDialog } from '../../apiHooks';

type Props = {
  roundId: number,
  show: boolean,
  onHide: () => void,
};

const RoundCardDialog = ({ roundId, show = false, onHide }: Props) => {
  const { data } = useRoundCardDialog({ roundId });

  const round = data?.round;

  return (
    <Modal centered show={show} onHide={onHide}>
      <RoundCard round={round} className="modal-card" canEdit={false} canShare />
    </Modal>
  );
};

export default RoundCardDialog;
