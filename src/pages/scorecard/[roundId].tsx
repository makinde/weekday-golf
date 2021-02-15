import React, { useEffect, useState } from 'react';
import {
  ToggleButtonGroup, ToggleButton, Dropdown,
} from 'react-bootstrap';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import find from 'lodash/find';
import some from 'lodash/some';
import toInteger from 'lodash/toInteger';

import { castArray } from 'lodash';
import Layout from '../../components/utils/Layout';
import Avatar from '../../components/utils/Avatar';
import sdk from '../../sdk';
import ScorecardPlayerList from '../../components/dataEntry/ScorecardPlayerList';

// When sorting the list of players, prioritize those who are playing in this
// round already, and then players who have played on this course before. That
// should effectively make it so that your firends are always at the top.
type IdObj = { id: number };
type Sorter = (roundPlayers: IdObj[], coursePlayers: IdObj[]) => (a: IdObj, b: IdObj) => number;
const addablePlayerSorter: Sorter = (roundPlayers, coursePlayers) => (a, b) => {
  const aId = { id: a.id };
  const bId = { id: b.id };

  if (some(roundPlayers, aId)) {
    if (!some(roundPlayers, bId)) {
      return -1;
    }
  } else if (some(roundPlayers, bId)) {
    return 1;
  } else if (some(coursePlayers, aId)) {
    if (!some(coursePlayers, bId)) {
      return -1;
    }
  } else if (some(coursePlayers, bId)) {
    return 1;
  }

  return 0;
};

const ScorecardPage = () => {
  const { query, replace } = useRouter();

  const [activeHoleNumber, setActiveHoleNumber] = useState<number>(1);
  const [activePlayerIds, setActivePlayerIds] = useState<number[]>([]);

  const roundId = toInteger(query.roundId);

  useEffect(
    () => setActivePlayerIds(
      castArray(query.actives).filter((p) => !!p).map(toInteger),
    ),
    [query.actives],
  );

  const { data } = useSWR(
    ['scorecardPage', roundId],
    () => sdk.scorecardPage({ roundId }),
  );

  const {
    holes = [],
    players = [],
    roundPlayers = [],
    coursePlayers = [],
  } = data ?? {};

  const activeHole = find(holes, { number: activeHoleNumber });
  const addablePlayers = players
    .filter((p) => !activePlayerIds.includes(p.id))
    .sort(addablePlayerSorter(roundPlayers, coursePlayers));

  return (
    <Layout title="Overview">
      <div className="d-flex mx-n3 mx-md-n5 p-3 bg-light">
        <span>
          Hole&nbsp;
          <span className="h1">{activeHoleNumber}</span>
        </span>
        <span className="ml-auto">
          Par&nbsp;
          <span className="h1">{activeHole?.par ?? '-'}</span>
        </span>
      </div>
      <ScorecardPlayerList
        playerIds={activePlayerIds}
        roundId={roundId}
        holeNumber={activeHoleNumber}
      />
      <Dropdown className="mb-auto">
        <Dropdown.Toggle variant="white" id="player-add-dropdown">
          Add Player
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {addablePlayers.map(({ id, img, fullName }) => (
            <Dropdown.Item
              onClick={() => replace({
                pathname: '/scorecard/[roundId]',
                query: { roundId, actives: [...activePlayerIds, id] },
              }, undefined, { shallow: true })}
              className="d-flex align-items-center"
              key={id}
            >
              <Avatar src={img} size="xs" className="mr-3" />
              {fullName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <ToggleButtonGroup
        name="hole_selector"
        type="radio"
        value={activeHoleNumber}
        onChange={setActiveHoleNumber}
      >
        {holes.map((hole) => (
          <ToggleButton key={hole.number} value={hole.number} variant="secondary">
            {hole.number}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Layout>
  );
};

export default ScorecardPage;
