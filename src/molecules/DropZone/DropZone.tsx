import React from 'react';
import Anchor from '../../atoms/Anchor/Anchor';
import AnswerWord from '../../atoms/AnswerWord/AnswerWord';
import { DropZonePropsType } from './DropZone.types';
import './DropZone.scss';
const DropZone = ({ dropName, answerWords }: DropZonePropsType) => {
  const renderItem = (word: string) => (
    <Anchor>
      <AnswerWord content={word} />
    </Anchor>
  );

  const renderList = () => {
    const list = [];
    const lastItems = answerWords.reduce((acc: React.ReactNode[], item) => {
      if (acc.length === 6) {
        list.push(<ul className="drop-zone__wrapper">{acc}</ul>);
        return [
          <li className="drop-zone__item">
            <AnswerWord content={item} />
          </li>,
        ];
      }

      return [
        ...acc,
        <li className="drop-zone__item">
          <AnswerWord content={item} />
        </li>,
      ];
    }, []);

    if (lastItems.length >= 1) {
      list.push(<ul className="drop-zone__wrapper">{lastItems}</ul>);
    }
    return list;
  };

  return (
    <div className="drop-zone">
      {dropName === 'answers' ? renderList() : answerWords.map((word) => renderItem(word))}
    </div>
  );
};

export default DropZone;
