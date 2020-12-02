import React from 'react';

type Props = {
  value: number,
};

const RelativeScore = ({ value }: Props) => {
  let result = '-';
  if (value > 0) {
    result = `+${value}`;
  } else if (value < 0) {
    result = `${value}`;
  } else if (value === 0) {
    result = 'E';
  }

  return (<>{result}</>);
};

export default RelativeScore;
