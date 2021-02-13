import React, { forwardRef } from 'react';
import AnswerWord from '../../atoms/AnswerWord/AnswerWord';
import { IDropAreaProps } from './DropArea.types';
import Draggable from '../../libs/Draggable/Draggable';
import './DropArea.scss';
import Anchor from '../../atoms/Anchor/Anchor';
import { IWord } from '../../atoms/AnswerWord/AnswerWord.types';
import { IAnchor } from '../../atoms/Anchor/Anchor.types';

const DropArea = forwardRef<any, IDropAreaProps>(
  (
    {
      areaName,
      anchors,
      words,
      originCoords,
      dragStartHandler,
      dragMoveHandler,
      dragEndHandler,
      isTransitioned,
      isBlockAnimaton,
    },
    ref
  ) => {
    const preparedWords: { [key: string]: IWord } = words.reduce(
      (acc, item) => ({ ...acc, [item.wordId]: { ...item } }),
      {}
    );
    const createWord = (anchor: IAnchor, isDataAttribute: boolean = false) => (
      <Anchor
        key={anchor.anchorId}
        isHidden={anchor.isHidden}
        isPrepared={anchor.isPrepared}
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
            <AnswerWord content={preparedWords[anchor.anchorId].text} key={preparedWords[anchor.anchorId].wordId} />
          </Draggable>
        )}
      </Anchor>
    );

    // [words] => [[words],[words],[wrods]...]
    const getPreparedAnchors = () =>
      [...Array(Math.ceil(anchors.length / 6)).keys()].map((row) => anchors.slice(row * 6, (row + 1) * 6));

    const createAnchors = () =>
      getPreparedAnchors().map((anchorWrapper, rowId) => (
        <ul key={rowId} className="drop-area__wrapper">
          {anchorWrapper.map((anchor) => createWord(anchor))}
        </ul>
      ));

    return areaName === 'answersArea' ? (
      <div className="drop-area" data-dropname={areaName} ref={ref}>
        {createAnchors()}
      </div>
    ) : (
      <ul className="drop-area" data-dropname={areaName} ref={ref}>
        {anchors.map((anchor) => createWord(anchor, true))}
      </ul>
    );
  }
);

export default DropArea;
