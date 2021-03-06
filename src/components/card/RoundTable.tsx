import cx from 'classnames';
import find from 'lodash/find';
import Link from 'next/link';
import React from 'react';
import { Table } from 'react-bootstrap';

import { RoundForTable } from '../../apiHooks';
import RelativeScore from '../utils/RelativeScore';
import { WinningsPill } from '../utils/Winnings';
import styles from './RoundTable.module.scss';
import ScoresHeader from './ScoresHeader';

const WINNING_CLASS = 'border-bottom border-bottom-4';

type Props = React.HTMLAttributes<any> & {
  round: RoundForTable,
};

const RoundTable = ({
  round,
  round: { course, playerRounds },
  className,
  ...props
}: Props) => (
  <Table
    size="sm"
    responsive
    className={cx(className, styles.table)}
    {...props}
  >
    <ScoresHeader holes={course.holes} id={`${round.id}-header`} />
    <tbody>
      {playerRounds.map((playerRound) => {
        const {
          player,
          skins,
          scores,
          roundBountyWinner,
          totalWinnings,
          relativeScore,
          rawRelativeScore,
          complete,
        } = playerRound;

        return (
          <tr key={player.id}>
            <td className="text-left border-right">
              <Link href={`/${course.slug}/${player.slug}`}>
                <a className="text-reset">
                  {player.nickname}
                </a>
              </Link>
              <WinningsPill value={totalWinnings} className="ml-2" />
            </td>
            {course.holes.map(({ number }) => {
              const holeScore = find(scores, { holeNumber: number });
              const holeSkin = find(skins, { holeNumber: number });
              const won = !!holeSkin?.won;
              const wonViaPush = !holeSkin
                  && !!find(skins, ({ holeNumber }) => holeNumber > number)?.won;

              return (
                <td
                  className={cx({
                    [WINNING_CLASS]: won || wonViaPush,
                    [styles.won]: won,
                  })}
                  key={number}
                >
                  {holeScore?.score || '-'}
                </td>
              );
            })}
            <td className={cx('border-left', {
              [WINNING_CLASS]: roundBountyWinner,
              [styles.won]: roundBountyWinner,
            })}
            >
              {complete ? (
                <RelativeScore value={relativeScore} />
              ) : (
                <>
                  (
                  <RelativeScore value={rawRelativeScore} />
                  )
                </>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

export default RoundTable;
