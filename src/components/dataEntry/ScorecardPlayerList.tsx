import React from 'react';
import useSWR from 'swr';
import find from 'lodash/find';
import defaults from 'lodash/defaults';
import reject from 'lodash/reject';
import Button from 'react-bootstrap/Button';

import Avatar from '../utils/Avatar';
import sdk from '../../sdk';
import { Score_Set_Input } from '../../types';

type Props = {
  roundId: number,
  playerIds: number[],
  holeNumber: number,
};

const ScorecardPlayerList = ({ roundId, playerIds, holeNumber }: Props) => {
  const { data, mutate } = useSWR(
    ['scorecardPlayerList', roundId, playerIds],
    () => sdk.scorecardPlayerList({ roundId, playerIds }),
  );

  const {
    courses: [{ courseId }] = [{ courseId: null }],
    holes = [],
    players = [],
    scores = [],
  } = data ?? {};

  const activeHole = find(holes, { number: holeNumber });

  return (
    <>
      {playerIds.map((playerId) => {
        const score = find(scores, { playerId, holeNumber });
        const scoreKey = { playerId, holeNumber, roundId };
        const player = find(players, { id: playerId });
        if (!player) { return null; }

        const saveScoreChange = async (scoreUpdate: Score_Set_Input) => {
          const deletingScore = !scoreUpdate.score;
          const existingScore = !!score;
          let newScores = [];
          if (!deletingScore) { newScores = [defaults({}, scoreUpdate, score)]; }

          mutate({
            ...data,
            scores: [
              ...reject(scores, { playerId, holeNumber }),
              ...newScores,
            ],
          }, false);

          // do SDK request
          if (existingScore) {
            if (deletingScore) {
              await sdk.scorecardPlayerListDelete(scoreKey);
            } else {
              await sdk.scorecardPlayerListUpdate({ scoreKey, scoreUpdate });
            }
          } else if (!deletingScore) {
            await sdk.scorecardPlayerListInsert({
              score: { ...scoreKey, courseId, ...scoreUpdate },
            });
          }
        };

        return (
          <div key={playerId} className="d-flex align-items-center py-3">
            <div className="flex-fill">
              <Avatar src={player.img} size="sm" className="mr-2" />
              {player.fullName}
            </div>
            <div>
              <input
                type="number"
                value={score?.score ?? ''}
                className="d-sm-inline-block d-none"
                size={2}
                step={1}
                min={0}
                onChange={async (e) => saveScoreChange({
                  score: parseInt(e.target.value, 10) || null,
                })}
              />
              <div className="d-block d-sm-none">
                <Button
                  variant="white"
                  className="btn-rounded-circle mr-2"
                  size="sm"
                  onClick={async () => saveScoreChange({
                    score: (score?.score ?? activeHole.par) - 1,
                  })}
                >
                  -
                </Button>
                {score?.score ?? '-'}
                <Button
                  variant="white"
                  className="btn-rounded-circle ml-2"
                  onClick={async () => saveScoreChange({
                    score: (score?.score ?? (activeHole.par - 1)) + 1,
                  })}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ScorecardPlayerList;
