import find from 'lodash/find';
import Link from 'next/link';
import React from 'react';
import {
  OverlayTrigger, Tooltip, Image,
} from 'react-bootstrap';

import Table from '../utils/Table';

import { RoundForTableFragment } from '../../types';
import RelativeScore from '../utils/RelativeScore';
import WinningsPill from '../utils/WinningsPill';

type Props = {
  round: RoundForTableFragment,
};

const RoundTable = ({ round, round: { course, playerRounds } }: Props) => (
  <>
    <div className="small text-muted">
      {round.skinsHoleBounty && (
        <>
          Skins: $
          {round.skinsHoleBounty}
          /hole&nbsp;&nbsp;
        </>
      )}
      {round.roundBounty && (
        <>
          Round Winner: $
          {round.roundBounty}
          &nbsp;&nbsp;
        </>
      )}
    </div>

    <Table>
      <thead>
        <tr>
          <Table.RowHeader as="th">
            Name
          </Table.RowHeader>
          {course.holes.map(({ number, nickname }) => (
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
            </th>
          ))}
          <Table.RowFooter as="th">
            Tot
          </Table.RowFooter>
        </tr>
      </thead>
      <tbody>
        {playerRounds.map((playerRound) => {
          const {
            player, skins, scores, roundBountyWinner, totalWinnings,
          } = playerRound;

          return (
            <tr key={player.id}>
              <Table.RowHeader>
                <Link href={`/player/${player.id}`}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="text-dark">
                    <Image
                      className="mr-1"
                      src={player.img}
                      height="26"
                      roundedCircle
                    />
                    {player.nickname}
                  </a>
                </Link>
                <WinningsPill value={totalWinnings} className="float-right" />
              </Table.RowHeader>
              {course.holes.map(({ number }) => {
                const holeScore = find(scores, { holeNumber: number });
                const holeSkin = find(skins, { holeNumber: number });
                const won = !!holeSkin?.won;
                const wonSubsequent = !holeSkin
                  && !!find(skins, ({ holeNumber }) => holeNumber > number)?.won;

                return (
                  <Table.HighlightableCell
                    highlight={won || wonSubsequent}
                    light={wonSubsequent}
                    key={number}
                  >
                    {holeScore?.score || '-'}
                  </Table.HighlightableCell>
                );
              })}
              <Table.HighlightableCell as={Table.RowFooter} highlight={roundBountyWinner}>
                <RelativeScore value={playerRound.relativeScore} />
              </Table.HighlightableCell>
            </tr>
          );
        })}
      </tbody>
    </Table>
  </>
);

export default RoundTable;
