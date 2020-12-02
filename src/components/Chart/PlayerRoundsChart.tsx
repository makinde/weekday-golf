import React, { useRef } from 'react';
import cx from 'classnames';
import * as d3 from 'd3';
import max from 'lodash/max';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import { OverlayTrigger, Tooltip, Image } from 'react-bootstrap';

import Axis from './Axis';
import Line from './Line';
import useResizeObserver from './useResizeObserver';
import CompactDate from '../utils/CompactDate';

import { PlayerRoundForChartFragment } from '../../types';

import styles from './styles/PlayerRoundsChart.module.scss';

const translate = (x: number, y: number): string => `translate(${x}, ${y})`;

const HEIGHT = 240;
const MARGIN = {
  bottom: 24,
  left: 8,
  right: 8,
  top: 16,
};
const PADDING = 1;

type Props = {
  playerRounds: PlayerRoundForChartFragment[],
  focusedPlayerId?: number,
  focusedRoundId?: number,
  onPlayerFocus?: (playerId: number | null) => void,
  onRoundFocus?: (roundId: number | null) => void,
};

const RoundsChart = ({
  playerRounds,
  focusedPlayerId,
  focusedRoundId,
  onPlayerFocus = () => {},
  onRoundFocus = () => {},
}: Props) => {
  const ref = useRef(null);
  const { height, width } = useResizeObserver(ref);

  const innerHeight = height - MARGIN.top - MARGIN.bottom;
  const innerWidth = width - MARGIN.left - MARGIN.right;

  const roundIds = sortBy(uniq(map(playerRounds, 'round.id')));
  const multiPlayerDisplay = uniqBy(playerRounds, 'player.id').length > 1;

  const xScale = d3.scalePoint(roundIds, [0, innerWidth]).padding(PADDING);
  const yScale = d3.scaleLinear()
    .domain([0, max(map(playerRounds, 'relativeScore'))])
    .rangeRound([innerHeight, 0]);

  const xAxis = d3.axisBottom(xScale).tickValues([]);
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(5)
    .tickSize(3);

  return (
    <div ref={ref}>
      <svg
        height={HEIGHT}
        width={width}
      >
        <g transform={translate(MARGIN.left, MARGIN.top)}>
          <Axis
            axis={xAxis}
            transform={translate(0, innerHeight)}
          />
          <Axis
            axis={yAxis}
            className={cx(styles.axis, styles.yAxis)}
          />
          {!!focusedPlayerId && (
            <Line
              className="focusedPlayer"
              data={filter(playerRounds, ['player.id', focusedPlayerId])}
              x={(d: PlayerRoundForChartFragment) => xScale(d.round.id)}
              y={(d: PlayerRoundForChartFragment) => yScale(d.relativeScore)}
            />
          )}
          {playerRounds.map(({ round, player, relativeScore }) => {
            const roundFocused = round.id === focusedRoundId;
            const playerFocused = player.id === focusedPlayerId;

            return (
              <OverlayTrigger
                key={`${player.id}-${round.id}`}
                placement="top"
                onToggle={(show) => {
                  onPlayerFocus(show ? player.id : null);
                  onRoundFocus(show ? round.id : null);
                }}
                overlay={(
                  <Tooltip id={`${player.id}-${round.id}`}>
                    {multiPlayerDisplay && (
                      <>
                        <Image
                          className="mr-1"
                          src={player.img}
                          height="26"
                          roundedCircle
                        />
                        {player.nickname}
                        <br />
                      </>
                    )}
                    <CompactDate date={round.date} />
                    <br />
                    +
                    {relativeScore}
                  </Tooltip>
                )}
              >
                <circle
                  className={cx({
                    [styles.backgroundPlayerRound]: !roundFocused,
                    [styles.focusedPlayer]: playerFocused,
                    [styles.focusedRound]: roundFocused,
                  })}
                  cx={xScale(round.id)}
                  cy={yScale(relativeScore)}
                  r={4}
                />
              </OverlayTrigger>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default RoundsChart;
