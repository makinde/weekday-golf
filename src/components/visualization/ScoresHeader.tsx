import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import sumBy from 'lodash/sumBy';

import { HoleForScoresHeaderFragment } from '../../types';

type Props = {
  holes: HoleForScoresHeaderFragment[],
  id: string,
  showTotal?: boolean,
};

const ScoresHeader = ({ holes, id, showTotal = true }: Props) => {
  const firstPar = holes[0].par;
  const uniformPar = holes.every(({ par }) => par === firstPar);

  return (
    <thead>
      <tr>
        <th className="border-right">
          {uniformPar && 'Name'}
          {!uniformPar && (
            <>
              Hole
              <br />
              <span className="font-weight-light">Par</span>
            </>
          )}
        </th>
        {holes.map(({ number, nickname, par }) => (
          <th key={`hole-${number}`}>
            {nickname === null && number}
            {nickname !== null && (
              <OverlayTrigger
                overlay={(
                  <Tooltip id={`${id}-hole-${number}`}>
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
        {showTotal && (
          <th className="border-left">
            Tot
            {!uniformPar && (
            <>
              <br />
              <span className="font-weight-light">
                {sumBy(holes, 'par')}
              </span>
            </>
            )}
          </th>
        )}
      </tr>
    </thead>
  );
};

export default ScoresHeader;
