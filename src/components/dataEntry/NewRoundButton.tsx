import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, ButtonProps } from 'react-bootstrap';

import { format } from 'date-fns';
import sdk from '../../sdk';

type Props = ButtonProps & React.PropsWithChildren<{
  courseId: number,
}>;

const NewRoundButton = ({ courseId, children, ...rest }: Props) => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const createRound = async () => {
    setLoading(true);
    const date = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss');
    const { insertRound } = await sdk.newRoundButtonInsert({ courseId, date });
    const { roundId } = insertRound;

    push(`/scorecard/${roundId}`);
  };

  return (
    <Button
      {...rest}
      disabled={loading ? true : rest.disabled}
      onClick={createRound}
    >
      {loading ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
      ) : children}
    </Button>
  );
};

export default NewRoundButton;
