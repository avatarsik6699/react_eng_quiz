import { TitlePropsType } from './Title.types';
import './Title.scss';
const Title = ({ content }: TitlePropsType) => {
  return <h1 className="title">{content}</h1>;
};

export default Title;
