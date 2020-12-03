import React from 'react';
import cx from 'classnames';

import AppTable from '../utils/AppTable';
import { EntryForLeaderboardFragment } from '../../types';
import RelativeScore from '../utils/RelativeScore';
import styles from './Leaderboard.module.scss';

type Props = {
  entries: EntryForLeaderboardFragment[],
  focusedRoundId?: number,
  onRoundFocus?: (roundId: number | null) => void,
};

const Leaderboard = ({
  entries,
  focusedRoundId,
  onRoundFocus = () => {},
}: Props) => (
  <AppTable size="sm" className={styles.table}>
    <tbody>
      {entries.map(({
        rank, playerRound: { relativeScore, player, round },
      }) => (
        <tr
          key={`${round.id}-${player.slug}`}
          onMouseEnter={() => onRoundFocus(round.id)}
          onMouseLeave={() => onRoundFocus(null)}
          className={cx({ 'bg-light': focusedRoundId === round.id })}
        >
          <td>{rank}</td>
          <td className="text-left">
            {player.nickname}
          </td>
          <td><RelativeScore value={relativeScore} /></td>
        </tr>
      ))}
    </tbody>
  </AppTable>
);

export default Leaderboard;
