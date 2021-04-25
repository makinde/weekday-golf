import React, { ComponentPropsWithoutRef } from 'react';
import { LineChart, Line, YAxis } from 'recharts';

type Props = ComponentPropsWithoutRef<typeof Line> & {
  data: Array<any>,
  id: string,
};

const Sparkline = ({
  data,
  dataKey = (d) => d,
  children,
  ...rest
}: Props) => (
  <LineChart
    width={75}
    height={30}
    data={data}
  >
    <YAxis hide type="number" domain={['dataMin', 'dataMax']} />
    <Line
      type="basis"
      dataKey={dataKey}
      stroke="#2C7BE5"
      dot={false}
      strokeWidth={2}
      isAnimationActive={false}
      connectNulls
      {...rest}
    />
    {children}
  </LineChart>
);

export default Sparkline;
