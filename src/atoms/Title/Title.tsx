import { ITitleProps } from './Title.types';
import StyledTitle from './Title.styles';

const Title = ({ content }: ITitleProps) => {
  return <StyledTitle>{content}</StyledTitle>;
};

export default Title;
