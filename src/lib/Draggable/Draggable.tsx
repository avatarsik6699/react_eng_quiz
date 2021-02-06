import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TRANSITION_TIME } from '../../settings/constants';
import { DraggablePropsType, GetBellowElement } from './Draggable.types';
import './Draggable.scss';
const INITIAL_SHIFT_COORDS = {
  shiftX: 0,
  shiftY: 0,
  initialX: 0,
  initialY: 0,
};
const INITIAL_TRANSLATE_COORDS = { x: 0, y: 0 };

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
  const inDropZone = useRef(false);
  const zoneNumber = useRef(0); // 0 - начало, 1 - попал в drop, 2 - вышел из drop
  const currentZone = useRef(null);

  // координаты перемещения---------------------------------------------
  const [translateCoords, setTranslateCoords] = useState(INITIAL_TRANSLATE_COORDS);
  const [shiftCoords, setShiftCoords] = useState(INITIAL_SHIFT_COORDS);

  // helpersFunctions---------------------------------------------------
  const setCurrentZone = useCallback(
    (dropZoneName) => {
      if (!inDropZone.current && zoneNumber.current === 0) {
        return null;
      }

      if (inDropZone.current && zoneNumber.current !== 1) {
        zoneNumber.current = 1;
        return dropZoneName;
      }

      if (!inDropZone.current && zoneNumber.current !== 2) {
        zoneNumber.current = 2;
        return 'out';
      }
    },
    [inDropZone]
  );

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

  const makeDraggableElement = (id: number) =>
    React.Children.map(children, (item) =>
      React.cloneElement(item, { ...item.props, style, onMouseDown: dragStart })
    );

  // handlerFunctions---------------------------------------------------
  const dragStart = useCallback(
    (ev: React.MouseEvent<HTMLSpanElement>) => {
      const draggableElem = ev.target as HTMLSpanElement;
      setDragStart(true);
      setShiftCoords((prevState) => ({
        ...prevState,
        shiftX: ev.clientX - draggableElem.getBoundingClientRect().x,
        shiftY: ev.clientY - draggableElem.getBoundingClientRect().y,
        initialX: draggableElem.getBoundingClientRect().x,
        initialY: draggableElem.getBoundingClientRect().y,
      }));

      dragStartHandler({
        draggableElemInfo,
        status: inDropZone.current,
      });
    },
    [dragStartHandler, draggableElemInfo]
  );
  const dragMove = useCallback(
    (ev: MouseEvent) => {
      const bellowElem = getBellowElement(ev.target as HTMLElement, ev.clientX, ev.clientY);
      const currentZoneName = setCurrentZone(bellowElem.dataset.dropname); // null/out/drop(answersZone, pendingZone)
      inDropZone.current = isDraggableElemInDropZone(bellowElem);
      if (currentZoneName) {
        currentZone.current = currentZoneName;
        console.log(currentZone.current);
        dragMoveHandler({ draggableElemInfo, currentZoneName });
      }

      setTranslateCoords((prevState) => ({
        ...prevState,
        x: ev.clientX - shiftCoords.initialX - shiftCoords.shiftX,
        y: ev.clientY - shiftCoords.initialY - shiftCoords.shiftY,
      }));
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
      inDropZone.current = inDropZone.current ? true : false;
      zoneNumber.current = 0;
      setDragStart(false);
      setTranslateCoords(INITIAL_TRANSLATE_COORDS);
      dragEndHandler({ draggableElemInfo, currentZoneName: currentZone.current });
      console.log(currentZone);
    },
    [dragEndHandler, draggableElemInfo]
  );

  useEffect(() => {
    if (isDragStart) {
      window.addEventListener('mousemove', dragMove);
      window.addEventListener('mouseup', dragEnd);
    } else {
      window.removeEventListener('mousemove', dragMove);
      window.removeEventListener('mouseup', dragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', dragMove);
      window.removeEventListener('mouseup', dragEnd);
    };
  }, [dragEnd, dragMove, isDragStart]);

  const style = useMemo(
    () => ({
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

  return <Fragment>{makeDraggableElement(draggableElemInfo.id)}</Fragment>;
};

export default React.memo(Draggable);
