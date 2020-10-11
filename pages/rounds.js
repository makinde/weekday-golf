import moment from 'moment-timezone';
import React, { Fragment } from 'react';
import { filter, find, sumBy, orderBy } from 'lodash';

import Layout from '../components/Layout';
import Table from '../components/Table';
import getAllData from '../data/getAllData';
import { getPlayerInfo } from '../data/utils';

import { HOLES, PAR } from '../constants';

import './styles/Rounds.scss';

/**
 * @typedef {import('../data/getAllData').Round} Round
 * @typedef {import('../data/getAllData').Score} Score
 *
 * @param {{ rounds: Round[], scores: Score[] }} props
 */
const RoundsPage = ({ rounds, scores }) => (
  <Layout title="Rounds">
    {rounds.map(({ id, date, players, timezone }) => (
      <Fragment key={date}>
        <h3>{moment.tz(date, timezone).format('ddd MMMM Do, YYYY')}</h3>
        <Table className="round-table">
          <thead>
            <tr>
              <th className="player-name">
                  Name
              </th>
              {HOLES.map((hole) => (
                <th key={`hole-${hole}`}>
                  {hole}
                </th>
              ))}
              <th className="total">
                  Total
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const playerRoundScores = filter(scores, { round: id, player });
              const roundTotal = sumBy(playerRoundScores, 'score');

              return (
                <tr key={player}>
                  <td className="player-name">
                    {getPlayerInfo(player).name}
                  </td>
                  {HOLES.map((hole) => (
                    <td key={`${date}-${player}-${hole}`}>
                      {find(playerRoundScores, { hole }).score}
                    </td>
                  ))}
                  <td className="total">
                    {roundTotal}
                    <span className="to-par">+{roundTotal - PAR}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Fragment>
    ))}
  </Layout>
);

export async function getStaticProps() {
  const { rounds, scores } = await getAllData();

  return {
    props: {
      rounds: orderBy(rounds, ['date'], ['desc']),
      scores,
    },
    revalidate: 30,
  };
}

export default RoundsPage;
