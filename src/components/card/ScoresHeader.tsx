import React from 'react';
import cx from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import sumBy from 'lodash/sumBy';

import { HoleForScoresHeader } from '../../types';

type Props = {
  holes: HoleForScoresHeader[],
  id: string,
  showTotal?: boolean,
};

const ScoresHeader = ({ holes, id, showTotal = true }: Props) => {
  const firstPar = holes[0].par;
  const uniformPar = holes.every(({ par }) => par === firstPar);
  const parAdjust = { 'py-2': !uniformPar };

  return (
    <thead>
      <tr>
        <th className={cx('border-right', parAdjust)}>
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
          <th key={`hole-${number}`} className={cx(parAdjust)}>
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
          <th className={cx('border-left', parAdjust)}>
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
