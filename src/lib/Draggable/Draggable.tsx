import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_SHIFT_COORDS,
  INITIAL_TRANSLATE_COORDS,
  TRANSITION_TIME,
} from '../../settings/constants';
import { DraggablePropsType, GetBellowElement } from './Draggable.types';
import './Draggable.scss';

const Draggable = ({
  draggableElemInfo,
  children,
  isTransitioned,
  originCoords,
  dragStartHandler,
  dragMoveHandler,
  dragEndHandler,
}: DraggablePropsType) => {
  const [isDragStart, setDragStart] = useState(false);
  const [isBlockAnimaton, setBlockAnimation] = useState(false);
  const inDropArea = useRef(false);
  const currentArea = useRef(draggableElemInfo.from === 'pending' ? 'pendingZone' : 'answersZone');
  const prevDropArea = useRef(draggableElemInfo.from === 'pending' ? 'pendingZone' : 'answersZone');
  const debounce = useRef<string>();
  // координаты перемещения---------------------------------------------
  const [translateCoords, setTranslateCoords] = useState(INITIAL_TRANSLATE_COORDS);
  const [shiftCoords, setShiftCoords] = useState(INITIAL_SHIFT_COORDS);

  // helpersFunctions---------------------------------------------------
  const setCurrentZone = useCallback((dropZoneName: string | null) => {
    const prevDA = prevDropArea.current.match(/(\w+)Zone/)![1];
    if (inDropArea.current && dropZoneName) {
      if (prevDA === dropZoneName) {
        return dropZoneName;
      } else {
        prevDropArea.current = dropZoneName;
        return dropZoneName;
      }
    } else {
      return `out-${prevDA}`;
    }
  }, []);

  const isDraggableElemInDropZone = useCallback(
    (bellowElem: null | HTMLElement) =>
      // если курсор выходит за viewport element = null
      bellowElem
        ? bellowElem.dataset.dropname || bellowElem.classList.contains('anchor')
          ? true
          : false
        : false,
    []
  );

  const getBellowElement: GetBellowElement = (target, x, y) => {
    target.classList.add('hidden');
    const bellowElem =
      (document.elementFromPoint(x, y)?.closest('.drop-zone') as HTMLElement) ??
      (document.elementFromPoint(x, y) as HTMLElement);
    target.classList.remove('hidden');

    return bellowElem;
  };

  const makeDraggableElement = () =>
    React.Children.map(children, (item) =>
      React.cloneElement(item, {
        ...item.props,
        style,
        onMouseDown: !isBlockAnimaton ? dragStart : null,
      })
    );

  // handlerFunctions---------------------------------------------------
  const dragStart = useCallback(
    (ev: React.MouseEvent<HTMLSpanElement>) => {
      const draggableElem = ev.target as HTMLSpanElement;
      draggableElem.classList.add('draggable');
      setDragStart(true);
      setShiftCoords((prevState) => ({
        ...prevState,
        shiftX: ev.clientX - draggableElem.getBoundingClientRect().x,
        shiftY: ev.clientY - draggableElem.getBoundingClientRect().y,
        initialX: draggableElem.getBoundingClientRect().x,
        initialY: draggableElem.getBoundingClientRect().y,
      }));

      dragStartHandler({
        from: draggableElemInfo.from,
        dragId: draggableElemInfo.wordId,
        currentZone: currentArea.current,
      });
      draggableElem.ondragstart = () => false;
    },
    [dragStartHandler, draggableElemInfo]
  );

  const dragMove = useCallback(
    (ev: MouseEvent) => {
      const bellowElem = getBellowElement(ev.target as HTMLElement, ev.clientX, ev.clientY);
      inDropArea.current = isDraggableElemInDropZone(bellowElem);
      const currentAreaName = setCurrentZone(bellowElem.dataset.dropname ?? null);

      if (currentAreaName !== debounce.current) {
        debounce.current = currentAreaName;
        currentArea.current = currentAreaName;

        dragMoveHandler({
          from: draggableElemInfo.from,
          dragId: draggableElemInfo.wordId,
          currentZone: currentArea.current,
        });
      }

      setTranslateCoords((prevState) => ({
        ...prevState,
        x: ev.clientX - shiftCoords.initialX - shiftCoords.shiftX,
        y: ev.clientY - shiftCoords.initialY - shiftCoords.shiftY,
      }));
      bellowElem.ondragstart = () => false;
    },
    [
      dragMoveHandler,
      draggableElemInfo,
      isDraggableElemInDropZone,
      setCurrentZone,
      shiftCoords.initialX,
      shiftCoords.initialY,
      shiftCoords.shiftX,
      shiftCoords.shiftY,
    ]
  );

  const dragEnd = useCallback(
    (ev: MouseEvent) => {
      (ev.target as HTMLElement).classList.remove('draggable');

      setDragStart(false);
      setTranslateCoords(INITIAL_TRANSLATE_COORDS);
      setBlockAnimation(true);

      dragEndHandler({
        from: draggableElemInfo.from,
        originId: draggableElemInfo.originId,
        dragId: draggableElemInfo.wordId,
        currentZone: currentArea.current,
      });
    },
    [dragEndHandler, draggableElemInfo]
  );

  useEffect(() => {
    if (isDragStart && !isBlockAnimaton) {
      window.addEventListener('mousemove', dragMove);
      window.addEventListener('mouseup', dragEnd);
    } else {
      window.removeEventListener('mousemove', dragMove);
      window.removeEventListener('mouseup', dragEnd);
      setTimeout(() => setBlockAnimation(false), TRANSITION_TIME);
    }

    return () => {
      window.removeEventListener('mousemove', dragMove);
      window.removeEventListener('mouseup', dragEnd);
    };
  }, [dragEnd, dragMove, isBlockAnimaton, isDragStart]);

  const style = useMemo(
    () => ({
      willChange: 'transform',
      transform: isDragStart
        ? `translate(
      ${translateCoords.x + originCoords.x}px, 
      ${translateCoords.y + originCoords.y}px)`
        : `translate(${originCoords.x}px, ${originCoords.y}px)`,
      transition: isDragStart || isTransitioned ? '' : `transform ${TRANSITION_TIME}ms ease`,
    }),
    [
      isDragStart,
      isTransitioned,
      originCoords.x,
      originCoords.y,
      translateCoords.x,
      translateCoords.y,
    ]
  );

  return <Fragment>{makeDraggableElement()}</Fragment>;
};

export default React.memo(Draggable);
