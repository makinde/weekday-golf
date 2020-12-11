import React from 'react';
import Avatar from './Avatar';

type AvatarProps = React.ComponentProps<typeof Avatar>;

type Props = React.PropsWithChildren<{
  max?: number,
  size?: AvatarProps['size'],
  shape?: AvatarProps['shape'],
}>;

const AvatarGroup = ({
  max = 10,
  size,
  shape,
  children,
}: Props) => {
  const count = React.Children.count(children);

  return (
    <div className="avatar-group">
      {count <= max
        ? children
        : (
          <>
            {React.Children.toArray(children).slice(0, max - 1)}
            <Avatar
              initials={`+${max - count + 1}`}
              size={size}
              shape={shape}
            />
          </>
        )}
    </div>
  );
};

export default AvatarGroup;
