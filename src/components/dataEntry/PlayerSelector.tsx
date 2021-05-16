import React from 'react';
import without from 'lodash/without';
import { ButtonProps, Dropdown } from 'react-bootstrap';
import find from 'lodash/find';

import AvatarGroup from '../utils/AvatarGroup';
import Avatar from '../utils/Avatar';
import { usePlayerSelector } from '../../apiHooks';

type PlayerSelectorProps = {
  playerIds: number[],
  setPlayerIds: (playerIds: number[]) => void,
  id: string,
};

const PlayerSelector = ({
  playerIds,
  setPlayerIds,
  id: elementId,
}: PlayerSelectorProps) => {
  const { data } = usePlayerSelector();
  const { players = [] } = data ?? {};

  return (
    <>
      {players.map(({ id, fullName }) => (
        <div key={id} className="custom-control custom-checkbox checklist-control">
          <input
            className="custom-control-input"
            id={`checklist-${elementId}-${id}`}
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
          <label className="custom-control-label" htmlFor={`checklist-${elementId}-${id}`} />
          <label htmlFor={`checklist-${elementId}-${id}`}>
            {fullName}
          </label>
        </div>
      ))}
    </>
  );
};

type MultiButtonProps = ButtonProps & {
  playerIds: number[],
  setPlayerIds: (playerIds: number[]) => void,
  id: string,
};

const MultiPlayerSelectorButton = ({
  playerIds,
  setPlayerIds,
  id: elementId,
  ...rest
}: MultiButtonProps) => {
  const { data } = usePlayerSelector();
  const { players = [] } = data ?? {};

  return (
    <Dropdown>
      <Dropdown.Toggle id={elementId} {...rest}>
        <AvatarGroup max={4}>
          {playerIds.map((playerId) => {
            const { img, fullName } = find(players, { id: playerId }) || {};
            return <Avatar src={img} alt={fullName} size="xs" key={playerId} />;
          })}
        </AvatarGroup>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div className="px-4">
          <PlayerSelector
            playerIds={playerIds}
            setPlayerIds={setPlayerIds}
            id={`${elementId}-multiselector`}
          />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const PlayerLockup = ({ player }) => (
  <>
    <Avatar src={player.img} alt={player.fullName} size="xs" className="mr-2" />
    {player.fullName}
  </>
);

type SingleButtonProps = ButtonProps & {
  playerId: number,
  setPlayerId: (playerId: number) => void,
  id: string,
};

const SinglePlayerSelectorButton = ({
  playerId,
  setPlayerId,
  id: elementId,
  ...rest
}: SingleButtonProps) => {
  const { data } = usePlayerSelector();
  const { players = [] } = data ?? {};
  const player = find(players, { id: playerId });

  return (
    <Dropdown>
      <Dropdown.Toggle id={elementId} {...rest}>
        {!playerId && 'Select a Player'}
        {playerId && !player && 'Loading...'}
        {player && <PlayerLockup player={player} />}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {players.map((pl) => (
          <Dropdown.Item key={pl.id} onSelect={() => setPlayerId(pl.id)}>
            <PlayerLockup player={pl} />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export {
  PlayerSelector as default,
  MultiPlayerSelectorButton,
  SinglePlayerSelectorButton,
};
