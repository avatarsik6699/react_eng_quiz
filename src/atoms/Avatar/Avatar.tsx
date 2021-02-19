import React from 'react';
import { IAvatarProps } from './Avatar.types';
import { DefaultAvatar, StyledAvatar } from './Avatar.styles';
const Avatar = ({ src }: IAvatarProps) => {
  return <StyledAvatar>{src ? <img src={src} alt="avatar" /> : <DefaultAvatar />}</StyledAvatar>;
};

export default Avatar;
