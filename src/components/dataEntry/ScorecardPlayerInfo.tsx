import React from 'react';

import find from 'lodash/find';
import { Media } from 'react-bootstrap';
import Avatar from '../utils/Avatar';
import sdk, { useSdk } from '../../sdk';

type Props = {
  courseId: number,
  playerId: number,
  holeNumber: number,
};

const ScorecardPlayerInfo = ({ courseId, playerId, holeNumber }: Props) => {
  const { data } = useSdk(
    sdk.scorecardPlayerInfo,
    { courseId, playerId },
    { offline: true },
  );

  const { player } = data ?? {};
  const { scoringInfo } = player ?? {};
  const stats = find(scoringInfo ?? [], { holeNumber }) ?? {};

  return (
    <>
      <Media>
        <Avatar
          src={player?.img}
          initials={`${player?.firstName?.[0] ?? ''}${player?.lastName[0] ?? ''}`}
          size="sm"
          className="mr-2"
        />
        <Media.Body>
          {player?.fullName}
          <br />
          <small>{stats.trailingAvgScore}</small>
        </Media.Body>
      </Media>
    </>
  );
};

export default ScorecardPlayerInfo;
