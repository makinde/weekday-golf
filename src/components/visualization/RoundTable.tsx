import cx from 'classnames';
import find from 'lodash/find';
import Link from 'next/link';
import React from 'react';
import {
  OverlayTrigger, Tooltip, Table,
} from 'react-bootstrap';

import { RoundForTableFragment } from '../../types';
import RelativeScore from '../utils/RelativeScore';
import WinningsPill from '../utils/WinningsPill';
import styles from './RoundTable.module.scss';

const WINNING_CLASS = 'border-bottom border-bottom-4';

type Props = React.HTMLAttributes<any> & {
  round: RoundForTableFragment,
};

const RoundTable = ({
  round,
  round: { course, playerRounds },
  className,
  ...props
}: Props) => {
  const firstPar = course.holes[0].par;
  const uniformPar = course.holes.every(({ par }) => par === firstPar);

  return (
    <Table
      size="sm"
      responsive
      className={cx(className, styles.table)}
      {...props}
    >
      <thead>
        <tr>
          <th className="border-right w-50">
            {uniformPar && 'Name'}
            {!uniformPar && (
            <>
              Hole
              <br />
              <span className="font-weight-light">Par</span>
            </>
            )}
          </th>
          {course.holes.map(({ number, nickname, par }) => (
            <th key={`hole-${number}`}>
              {nickname === null && number}
              {nickname !== null && (
              <OverlayTrigger
                overlay={(
                  <Tooltip id={`${round.id}-hole-${number}`}>
                    {nickname}
                  </Tooltip>
                    )}
                placement="top"
              >
                <span>{number}</span>
              </OverlayTrigger>
              )}
              {!uniformPar && (
              <>
                <br />
                <span className="font-weight-light">{par}</span>
              </>
              )}
            </th>
          ))}
          <th className="border-left">
            Tot
            {!uniformPar && (
            <>
              <br />
              <span className="font-weight-light">
                {course.holes_aggregate.aggregate.sum.par}
              </span>
            </>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {playerRounds.map((playerRound) => {
          const {
            player, skins, scores, roundBountyWinner, totalWinnings,
          } = playerRound;

          return (
            <tr key={player.id}>
              <td className="text-left border-right">
                <Link href={`/player/${player.id}`}>
                  <a className="text-reset">
                    {player.nickname}
                  </a>
                </Link>
                <WinningsPill value={totalWinnings} className="float-right" />
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
                <RelativeScore value={playerRound.relativeScore} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default RoundTable;
