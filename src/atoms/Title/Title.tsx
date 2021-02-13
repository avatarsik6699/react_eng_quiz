import { ITitleProps } from './Title.types';
import './Title.scss';
const Title = ({ content }: ITitleProps) => {
  return <h1 className="title">{content}</h1>;
};

export default Title;
