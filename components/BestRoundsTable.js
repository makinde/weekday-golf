import React from 'react';
import { round as roundTo, find } from 'lodash';

import Table from './Table';
import { getPlayerInfo } from '../data/utils';
import { PAR } from '../constants';

/**
 * @typedef {import('../data/getAllData').Round} Round
 * @typedef {import('../data/utils').PlayerRoundSummary} PlayerRoundSummary
 */

/**
 * @param {{ rounds: Round[], topRounds: PlayerRoundSummary[] }} props
 */
export default function BestRoundsTable({ rounds, topRounds }) {
  const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  let place = 1;

  return (
    <Table className="round-table">
      <thead>
        <tr>
          <th className="player-place">Place</th>
          <th className="player-name">
            Name
          </th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {topRounds.map(({ round, player, total }, idx) => {
          const { date } = find(rounds, { id: round });
          const { name } = getPlayerInfo(player);

          if (idx > 0 && total !== topRounds[idx - 1].total) {
            place = idx + 1;
          }

          return (
            <tr key={`${name}-${date}`}>
              <td>{place}</td>
              <td className="player-name">{name}</td>
              <td>{total} (+{roundTo(total - PAR, 1)})</td>
              <td>
                {new Date(date).toLocaleDateString(undefined, dateOptions)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}