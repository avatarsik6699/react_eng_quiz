import React from 'react';
import Anchor from '../../atoms/Anchor/Anchor';
import AnswerWord from '../../atoms/AnswerWord/AnswerWord';
import { DropZonePropsType } from './DropZone.types';
import Draggable from '../../lib/Draggable/Draggable';
import './DropZone.scss';

const DropZone = ({
  dropName,
  anchors,
  words,
  originCoords,
  dragStartHandler,
  dragMoveHandler,
  dragEndHandler,
  link,
}: DropZonePropsType) => {
  const renderList = () => {
    const list = [];
    let rowId = 0;
    const lastItems = anchors.reduce((acc: React.ReactNode[], item, index) => {
      if (acc.length === 6) {
        list.push(
          <ul key={rowId} className="drop-zone__wrapper">
            {acc}
          </ul>
        );
        rowId += 1;
        return [<Anchor key={index} isHidden={item.isHidden} isPrepared={item.isPrepared} />];
      }

      return [...acc, <Anchor key={index} isHidden={item.isHidden} isPrepared={item.isPrepared} />];
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
    <div className="drop-zone" data-dropname={dropName} ref={link}>
      {renderList()}
    </div>
  ) : (
    <ul className="drop-zone" data-dropname={dropName} ref={link}>
      {anchors.map((anchor) => (
        <Anchor key={anchor.anchorId}>
          {words[anchor.anchorId] && (
            <Draggable
              draggableElemInfo={{ ...words[anchor.anchorId] }}
              isTransitioned={false}
              originCoords={originCoords[anchor.anchorId] ?? { x: 0, y: 0 }}
              dragStartHandler={dragStartHandler}
              dragMoveHandler={dragMoveHandler}
              dragEndHandler={dragEndHandler}
            >
              <AnswerWord
                content={words[anchor.anchorId].text}
                key={words[anchor.anchorId].wordId}
              />
            </Draggable>
          )}
        </Anchor>
      ))}
    </ul>
  );
};

export default DropZone;
