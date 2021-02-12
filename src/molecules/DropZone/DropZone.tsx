import React from 'react';
import AnswerWord from '../../atoms/AnswerWord/AnswerWord';
import { DropZonePropsType } from './DropZone.types';
import Draggable from '../../lib/Draggable/Draggable';
import './DropZone.scss';
import Anchor from '../../atoms/Anchor/Anchor';
import { AnchorElementType } from '../../atoms/Anchor/Anchor.types';
import { WordElementType } from '../../atoms/AnswerWord/AnswerWord.types';

const DropZone = ({
  dropName,
  anchors,
  words,
  originCoords,
  dragStartHandler,
  dragMoveHandler,
  dragEndHandler,
  link,
  isTransitioned,
  isBlockAnimaton,
}: DropZonePropsType) => {
  const preparedWords: { [key: string]: WordElementType } = words.reduce(
    (acc, item) => ({ ...acc, [item.wordId]: { ...item } }),
    {}
  );

  const createWord = (anchor: AnchorElementType, isDataAttribute: boolean = false) => (
    <Anchor
      key={anchor.anchorId}
      isHidden={anchor.isHidden}
      isPrepared={anchor.isPrepared}
      isdisappear={anchor.isdisappear}
      isDataAttr={isDataAttribute}
      id={anchor.anchorId}
    >
      {preparedWords[anchor.anchorId] && (
        <Draggable
          draggableElemInfo={{ ...preparedWords[anchor.anchorId] }}
          isTransitioned={isTransitioned}
          originCoords={originCoords[anchor.anchorId] ?? { x: 0, y: 0 }}
          dragStartHandler={dragStartHandler}
          dragMoveHandler={dragMoveHandler}
          dragEndHandler={dragEndHandler}
          isBlockAnimaton={isBlockAnimaton}
        >
          <AnswerWord
            content={preparedWords[anchor.anchorId].text}
            key={preparedWords[anchor.anchorId].wordId}
          />
        </Draggable>
      )}
    </Anchor>
  );

  // [words] => [[words],[words],[wrods]...]
  const getPreparedAnchors = () =>
    [...Array(Math.ceil(anchors.length / 6)).keys()].map((row) =>
      anchors.slice(row * 6, (row + 1) * 6)
    );

  const createAnchors = () =>
    getPreparedAnchors().map((anchorWrapper, rowId) => (
      <ul key={rowId} className="drop-zone__wrapper">
        {anchorWrapper.map((anchor) => createWord(anchor))}
      </ul>
    ));

  return dropName === 'answersZone' ? (
    <div className="drop-zone" data-dropname={dropName} ref={link}>
      {createAnchors()}
    </div>
  ) : (
    <ul className="drop-zone" data-dropname={dropName} ref={link}>
      {anchors.map((anchor) => createWord(anchor, true))}
    </ul>
  );
};

export default DropZone;
