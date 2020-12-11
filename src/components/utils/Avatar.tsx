import React from 'react';
import cx from 'classnames';

type Props = React.HTMLAttributes<any> & {
  as?: React.ElementType,
  src?: string,
  alt?: string,
  initials?: string,
  size?: 'xxl' | 'xl' | 'lg' | 'sm' | 'xs',
  online?: boolean,
  offline?: boolean,
  shape?: 'rounded' | 'rounded-circle',
  className?: string,
};

const Avatar = ({
  as: AsComponent = 'div',
  src,
  alt,
  initials = '??',
  size,
  online = false,
  offline = false,
  shape = 'rounded-circle',
  className,
  ...props
}: Props) => (
  <AsComponent
    className={cx(className, 'avatar', {
      [`avatar-${size}`]: !!size,
      'avatar-online': online,
      'avatar-offline': offline,
    })}
    {...props}
  >
    {!!src && (
      <img src={src} alt={alt} className={cx('avatar-img', shape)} />
    )}
    {!src && (
      <span className={cx('avatar-title', shape)}>{initials}</span>
    )}
  </AsComponent>
);

export default Avatar;
