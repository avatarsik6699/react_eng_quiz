import React from 'react';
import AnswerWord from '../../atoms/AnswerWord/AnswerWord';
import { DropZonePropsType } from './DropZone.types';
import Draggable from '../../lib/Draggable/Draggable';
import './DropZone.scss';
import Anchor from '../../atoms/Anchor/Anchor';
import { AnchorElementType } from '../../atoms/Anchor/Anchor.types';

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
}: DropZonePropsType) => {
  const createWord = (data: AnchorElementType) => (
    <Anchor
      key={data.anchorId}
      isHidden={data.isHidden}
      isPrepared={data.isPrepared}
      isdisappear={data.isdisappear}
    >
      {words[data.anchorId] && (
        <Draggable
          draggableElemInfo={{ ...words[data.anchorId] }}
          isTransitioned={isTransitioned}
          originCoords={originCoords[data.anchorId] ?? { x: 0, y: 0 }}
          dragStartHandler={dragStartHandler}
          dragMoveHandler={dragMoveHandler}
          dragEndHandler={dragEndHandler}
        >
          <AnswerWord content={words[data.anchorId].text} key={words[data.anchorId].wordId} />
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
      {anchors.map((anchor) => createWord(anchor))}
    </ul>
  );
};

export default DropZone;
