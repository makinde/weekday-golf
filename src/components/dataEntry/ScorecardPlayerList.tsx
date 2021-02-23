import React from 'react';
import find from 'lodash/find';
import Button from 'react-bootstrap/Button';

import { CourseForScorecardPlayerList, OfflineRoundScores } from '../../types';
import ScorecardPlayerInfo from './ScorecardPlayerInfo';
import useOfflineScores from './useOfflineScores';

type OfflineScore = OfflineRoundScores['scores'][0];

type Props = {
  roundId: number,
  course: CourseForScorecardPlayerList,
  playerIds: number[],
  holeNumber: number,
};

const ScorecardPlayerList = ({
  roundId, course, playerIds, holeNumber,
}: Props) => {
  const { id: courseId, holes } = course;
  const { data, updateScore } = useOfflineScores(roundId);

  const { scores = [] } = data ?? {};

  const activeHole = find(holes, { number: holeNumber });

  return (
    <>
      {playerIds.map((playerId) => {
        const scoreKey = { playerId, holeNumber, roundId };
        const score = find<OfflineScore>(scores, scoreKey);

        return (
          <div key={playerId} className="d-flex align-items-center py-3">
            <div className="flex-fill">
              <ScorecardPlayerInfo
                courseId={courseId}
                playerId={playerId}
                holeNumber={holeNumber}
              />
            </div>
            <div>
              <input
                type="number"
                value={score?.score ?? ''}
                className="d-sm-inline-block d-none"
                size={2}
                step={1}
                min={0}
                onChange={async (e) => updateScore({
                  scoreKey,
                  courseId,
                  scoreUpdate: {
                    score: parseInt(e.target.value, 10) || null,
                  },
                })}
              />
              <div className="d-block d-sm-none">
                <Button
                  variant="white"
                  className="btn-rounded-circle mr-2"
                  size="sm"
                  onClick={async () => updateScore({
                    scoreKey,
                    courseId,
                    scoreUpdate: {
                      score: ((score?.score ?? activeHole.par) - 1) || null,
                    },
                  })}
                >
                  -
                </Button>
                {score?.score ?? '-'}
                <Button
                  variant="white"
                  className="btn-rounded-circle ml-2"
                  onClick={async () => updateScore({
                    scoreKey,
                    courseId,
                    scoreUpdate: {
                      score: (score?.score ?? (activeHole.par - 1)) + 1,
                    },
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
