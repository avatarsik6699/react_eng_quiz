import React from 'react';
import { IAvatarProps } from './Avatar.types';
import './Avatar.scss';
const Avatar = ({ src }: IAvatarProps) => {
  const cls = 'avatar__img';
  return (
    <div className="avatar">
      {src ? <img className={cls} src={src} alt="avatar" /> : <div className={`${cls}-default`}></div>}
    </div>
  );
};

export default Avatar;
