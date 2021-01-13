import React from 'react';
import { Button } from 'react-bootstrap';
import useSWR from 'swr';
import defaults from 'lodash/defaults';

import sdk from '../../sdk';

import {
  Score_Pk_Columns_Input,
  Score_Set_Input,
} from '../../types';

type Props = {
  par: number,
  scoreKey: Score_Pk_Columns_Input,
  courseId: number,
};

const HoleInput = ({ par, scoreKey, courseId } : Props) => {
  const { data, mutate } = useSWR(
    ['HoleInput', scoreKey.holeNumber, scoreKey.playerId, scoreKey.roundId],
    () => sdk.holeInput(scoreKey),
  );

  const score = data?.score?.score;

  const saveScoreChange = async (scoreUpdate: Score_Set_Input) => {
    const newScore = defaults({}, scoreUpdate, data.score);
    mutate({ score: newScore }, false);

    // do SDK request
    if (score === null) {
      await sdk.holeInputInsert({ score: { ...scoreKey, courseId, ...scoreUpdate } });
    } else if (scoreUpdate.score === null) {
      await sdk.holeInputDelete(scoreKey);
    } else {
      await sdk.holeInputUpdate({ scoreKey, scoreUpdate });
    }
  };

  return (
    <>
      <input
        type="number"
        value={score}
        className="d-sm-inline-block d-none"
        size={2}
        onChange={async (e) => saveScoreChange({
          score: parseInt(e.target.value, 10) || null,
        })}
      />
      <div className="d-block d-sm-none">
        <Button
          size="sm"
          variant="link"
          className="text-reset mr-1"
          onClick={async () => saveScoreChange({
            score: ((score ?? par) - 1) || null,
          })}
        >
          <i className="fe fe-minus-circle mr-1" />
        </Button>
        {score ?? '-'}
        <Button
          variant="link"
          className="text-reset mr-1"
          onClick={() => saveScoreChange({
            score: (score ?? (par - 1)) + 1,
          })}
        >
          <i className="fe fe-plus-circle mr-1" />
        </Button>
      </div>
    </>
  );
};

export default HoleInput;