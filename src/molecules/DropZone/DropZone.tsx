import React from 'react';
import Anchor from '../../atoms/Anchor/Anchor';
import AnswerWord from '../../atoms/AnswerWord/AnswerWord';
import { DropZonePropsType } from './DropZone.types';
import Draggable from '../../lib/Draggable/Draggable';
import './DropZone.scss';

const DropZone = ({ dropName, answerWords }: DropZonePropsType) => {
  const renderList = () => {
    const list = [];
    let rowId = 0;
    const lastItems = answerWords.reduce((acc: React.ReactNode[], item, index) => {
      if (acc.length === 6) {
        list.push(
          <ul key={rowId} className="drop-zone__wrapper">
            {acc}
          </ul>
        );
        rowId += 1;
        return [<Anchor key={index} isHidden={true} />];
      }

      return [...acc, <Anchor key={index} isHidden={true} />];
    }, []);

    if (lastItems.length >= 1) {
      list.push(
        <ul key={rowId + 1} className="drop-zone__wrapper">
          {lastItems}
        </ul>
      );
    }
    return list;
  };

  return dropName === 'answersZone' ? (
    <div className="drop-zone" data-dropname={dropName}>
      {renderList()}
    </div>
  ) : (
    <ul className="drop-zone" data-dropname={dropName}>
      {answerWords.map((word, id) => (
        <Anchor key={id}>
          <Draggable
            draggableElemInfo={{ id }}
            isTransitioned={false}
            originCoords={{ x: 0, y: 0 }}
            dragStartHandler={console.log}
            dragMoveHandler={console.log}
            dragEndHandler={console.log}
          >
            <AnswerWord content={word} key={id} />
          </Draggable>
        </Anchor>
      ))}
    </ul>
  );
};

export default DropZone;
