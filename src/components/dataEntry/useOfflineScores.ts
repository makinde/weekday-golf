import { useEffect, useState } from 'react';
import { cache, mutate, responseInterface } from 'swr';
import { useLocalStorage, useNetworkState } from 'react-use';
import defaults from 'lodash/defaults';
import partition from 'lodash/partition';
import some from 'lodash/some';
import useLatest from 'use-latest';

import sdk, { useSdk, getCacheKey } from '../../sdk';
import {
  OfflineRoundScores,
  Score_Pk_Columns_Input,
  Score_Set_Input,
} from '../../types';

type UpdateArgs = {
  scoreKey: Score_Pk_Columns_Input,
  scoreUpdate: Score_Set_Input,
  courseId: number,
};
type PendingUpdates = Array<UpdateArgs>;
type UseOfflineScores = (roundId: number) => responseInterface<OfflineRoundScores, any> & {
  updateScore: (updateAgs: UpdateArgs) => void,
};

const QUEUE_STORAGE_KEY = 'useOfflineScores:Queue';
const SDK_FUNC = sdk.offlineRoundScores;
const isDeletion = (updateArgs: UpdateArgs) => updateArgs.scoreUpdate.score === null;
const isExistingScore = (updateArgs: UpdateArgs) => {
  const cacheKey = getCacheKey(SDK_FUNC, { roundId: updateArgs.scoreKey.roundId });
  const { scores = [] } = cache.get(cacheKey);

  return some(scores, updateArgs.scoreKey);
};

const updateCache = ({ scoreKey, scoreUpdate }: UpdateArgs) => {
  const cacheKey = getCacheKey(SDK_FUNC, { roundId: scoreKey.roundId });
  const deletingScore = !scoreUpdate.score;

  const mutateKey = (data) => {
    const { scores = [] } = data ?? {};
    const [[score], otherScores] = partition(scores, scoreKey);

    return {
      scores: [
        ...otherScores,
        ...(deletingScore ? [] : [defaults({}, scoreUpdate, score)]),
      ],
    };
  };

  mutate(cacheKey, mutateKey, false);
};

const processScoreUpdateItem = async (updateArgs: UpdateArgs) => {
  const { scoreKey, scoreUpdate, courseId } = updateArgs;
  const deletion = isDeletion(updateArgs);
  const existing = isExistingScore(updateArgs);

  // console.log('starting update: ', scoreUpdate);

  // do SDK request
  if (existing) {
    if (deletion) {
      await sdk.offlineRoundScoresDelete(scoreKey);
    } else {
      await sdk.offlineRoundScoresUpdate({ scoreKey, scoreUpdate });
    }
  } else if (deletion) {
    await sdk.offlineRoundScoresInsert({
      score: { ...scoreKey, courseId, ...scoreUpdate },
    });
  }
  // console.log('update complete: ', scoreUpdate);
};

const useOfflineScores: UseOfflineScores = (roundId) => {
  const { online } = useNetworkState();
  const [pending, setPending] = useState(false);
  const [
    pendingUpdates,
    setPendingUpdates,
  ] = useLocalStorage<PendingUpdates>(QUEUE_STORAGE_KEY, []);
  const swrResult = useSdk(sdk.offlineRoundScores, { roundId }, {
    offline: true,
    onSuccess() {
      // When data comes back, apply any offline mutations that are in the
      // queue so the data you see always reflects the unsynced data the
      // user has entered.
      pendingUpdates.map(updateCache);
    },
  });

  // There's a bug in useLocalStoage: https://github.com/streamich/react-use/issues/1379
  // The set function doesn't pass an updated value to the setter function you
  // pass it. This means the useEffect call can't get the latest version of the queue.
  // To get around this, we use the useLatest hook.
  const latestPendingUpdates = useLatest(pendingUpdates);

  // Method for components to sumbit score updates. Cache gets updated immediately
  // with the new data and the update is added to the queue to the sent to the
  // server.
  const updateScore = (updateArgs: UpdateArgs) => {
    updateCache(updateArgs);
    // console.log('adding pending update: ', conciseUpdates([...pendingUpdates, updateArgs]));
    setPendingUpdates([...pendingUpdates, updateArgs]);
  };

  // const conciseUpdates = ((updates:PendingUpdates) =>
  // updates.map((update) => update.scoreUpdate));

  // Every time online status changes or the pending updates list changes
  // in (length), try to process the oldest item in the queue. If this is
  // successful, remove it from the queue, which should kick off the process
  // all over again. If the update errors, then stop, and you'll try it again
  // the next time the user goes online.
  //
  // TODO: is this bad that a real error may occur and we won't process again
  // until there's an offline->online switch?
  useEffect(() => {
    // console.log('queue/online/pending change',
    // pending, online, conciseUpdates(latestPendingUpdates.current));
    const execute = async () => {
      const updateArgs = pendingUpdates[0];
      setPending(true);
      try {
        await processScoreUpdateItem(updateArgs);

        const [, ...remainingUpdates] = latestPendingUpdates.current;
        // console.log('reducing remaining updates: ', conciseUpdates(remainingUpdates));
        setPendingUpdates(remainingUpdates);
      } catch (e) {
        return;
      } finally {
        // console.log('set pending to false');
        setPending(false);
      }
    };

    if (!pending && online && latestPendingUpdates.current[0]) {
      execute();
    }
  }, [pending, online, latestPendingUpdates.current]);

  return { ...swrResult, updateScore };
};

export default useOfflineScores;
