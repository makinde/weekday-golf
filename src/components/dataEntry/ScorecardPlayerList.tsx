import React from 'react';
import find from 'lodash/find';
import Button from 'react-bootstrap/Button';
import { useQueryClient } from 'react-query';
import partition from 'lodash/partition';
import has from 'lodash/has';

import ScorecardPlayerInfo from './ScorecardPlayerInfo';
import {
  CourseForScorecardPlayerList,
  useScoresForRound,
  useRoundScoresDelete,
  ScoresForRound,
  useRoundScoresUpsert,
  Score_Insert_Input,
  Score_Update_Column,
} from '../../apiHooks';

type ScoreFromList = ScoresForRound['scores'][0];
type DeletionContext = {
  deletedScore: ScoreFromList,
};
type UpsertContext = {
  previousScore: ScoreFromList,
  newScore: Score_Insert_Input
};

type Props = {
  roundId: number,
  course: CourseForScorecardPlayerList,
  playerIds: number[],
  holeNumber: number,
};

const RETRIES = 5;

const ScorecardPlayerList = ({
  roundId, course, playerIds, holeNumber,
}: Props) => {
  const { id: courseId, holes } = course;

  const { data } = useScoresForRound({ roundId });

  const queryClient = useQueryClient();
  const queryKey = useScoresForRound.getKey({ roundId });
  const { mutate: deletionMutate } = useRoundScoresDelete<unknown, DeletionContext>({
    retry: RETRIES,
    onMutate: async (scoreKey) => {
      await queryClient.cancelQueries(queryKey);
      const { scores } = queryClient.getQueryData<ScoresForRound>(queryKey);
      const [[deletedScore], otherScores] = partition<ScoreFromList>(scores, scoreKey);
      queryClient.setQueryData(queryKey, { scores: otherScores });

      return { deletedScore };
    },
    onError: async (err, mutationData, { deletedScore }) => {
      queryClient.setQueryData<ScoresForRound>(
        queryKey,
        ({ scores }) => ({ scores: [...scores, deletedScore] }),
      );
    },
  });

  const { mutate: upsertMutate } = useRoundScoresUpsert<unknown, UpsertContext>({
    retry: RETRIES,
    onMutate: async (mutationData) => {
      await queryClient.cancelQueries(queryKey);

      const { scoreData, scoreData: { playerId } } = mutationData;
      const scoreKey = { playerId, holeNumber, roundId };
      const { scores } = queryClient.getQueryData<ScoresForRound>(queryKey);
      const [[previousScore], otherScores] = partition<ScoreFromList>(scores, scoreKey);
      const newScore = previousScore ? { ...previousScore, ...scoreData } : scoreData;
      queryClient.setQueryData(queryKey, { scores: [...otherScores, newScore] });

      return { previousScore, newScore };
    },
    onError: async (err, mutationData, context) => {
      queryClient.setQueryData<ScoresForRound>(queryKey, ({ scores }) => {
        const [[attemptedScore], otherScores] = partition<ScoreFromList>(scores, context.newScore);

        if (attemptedScore && context.previousScore) {
          // This must have been an update, so include the old value
          return { scores: [...otherScores, context.previousScore] };
        } if (attemptedScore) {
          // This is an insertion, so just leave out this score
          return { scores: otherScores };
        }

        // If we can't find the exact item that we tried to add, it means there have been other
        // edits since we started. Just ignore this error and keep things moving.
        return { scores };
      });
    },
  });

  const updateScore = ({ scoreKey, scoreUpdate }) => {
    if (scoreUpdate.score === null) {
      deletionMutate(scoreKey);
      return;
    }

    const scoreData = { ...scoreKey, ...scoreUpdate, courseId };
    const updateColumns = [Score_Update_Column.Score];
    if (has(scoreUpdate, 'putts')) {
      updateColumns.push(Score_Update_Column.Putts);
    }
    upsertMutate({ scoreData, updateColumns });
  };

  const { scores = [] } = data ?? {};

  const activeHole = find(holes, { number: holeNumber });

  return (
    <>
      {playerIds.map((playerId) => {
        const scoreKey = { playerId, holeNumber, roundId };
        const score = find<ScoreFromList>(scores, scoreKey);

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
                  scoreUpdate: {
                    score: parseInt(e.target.value, 10) || null,
                  },
                })}
              />
              <div className="d-block d-sm-none">
                <Button
                  variant="link"
                  className="mr-2 text-reset"
                  onClick={async () => updateScore({
                    scoreKey,
                    scoreUpdate: {
                      score: ((score?.score ?? activeHole.par) - 1) || null,
                    },
                  })}
                >
                  <i className="fe fe-minus-circle h1" />
                </Button>
                <span className="h1 font-weight-normal">{score?.score ?? '-'}</span>
                <Button
                  variant="link"
                  className="ml-2 text-reset"
                  onClick={async () => updateScore({
                    scoreKey,
                    scoreUpdate: {
                      score: (score?.score ?? (activeHole.par - 1)) + 1,
                    },
                  })}
                >
                  <i className="fe fe-plus-circle h1 " />
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
