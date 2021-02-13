import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_SHIFT_COORDS, INITIAL_TRANSLATE_COORDS, TRANSITION_TIME } from '../../settings/constants';
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
  isBlockAnimaton,
}: DraggablePropsType) => {
  // ANIMATION CONTROL------------------------------------------------------------
  const [isDragStart, setDragStart] = useState(false);
  const [draggableElem, setDraggableElem] = useState<HTMLElement | null>(null);

  // SETTINGS FOR DETERMINING THE CURRENT ZONE (bellow element)-------------------
  const inDropArea = useRef(false);
  const currentArea = useRef(draggableElemInfo.from === 'pending' ? 'pendingZone' : 'answersZone');
  const prevDropArea = useRef(draggableElemInfo.from === 'pending' ? 'pendingZone' : 'answersZone');
  const debounce = useRef<string>();

  // TRANSLATE COORDS-------------------------------------------------------------
  const [translateCoords, setTranslateCoords] = useState(INITIAL_TRANSLATE_COORDS);
  const [shiftCoords, setShiftCoords] = useState(INITIAL_SHIFT_COORDS);

  // HELPERS FUNCTIONS---------------------------------------------------
  const getBellowElemDataAttr = (bellowElem: HTMLElement | null) => {
    if (bellowElem) {
      return Object.keys(bellowElem.dataset).length !== 0
        ? bellowElem.dataset.dropname
          ? (bellowElem.dataset.dropname as string)
          : (bellowElem.dataset.anchor as string)
        : null;
    } else {
      return null;
    }
  };

  const defineElemFromPoint = (selector: string | string[], coords: [x: number, y: number]) =>
    Array.isArray(selector)
      ? selector.reduce(
          (elem: HTMLElement | null, s) =>
            elem === null && document.elementFromPoint(...coords) !== null
              ? (document.elementFromPoint(...coords) as HTMLElement).closest(s)
                ? (document.elementFromPoint(...coords) as HTMLElement).closest(s)
                : elem
              : elem,
          null
        )
      : ((document.elementFromPoint(...coords) as HTMLElement).closest(selector) as HTMLElement);

  const setCurrentZone = useCallback((dropZoneName: string | null) => {
    if (inDropArea.current && dropZoneName) {
      if (prevDropArea.current === dropZoneName) {
        return dropZoneName;
      } else {
        prevDropArea.current = dropZoneName;
        return dropZoneName;
      }
    } else {
      return `out-${prevDropArea.current}`;
    }
  }, []);

  const isDraggableElemInDropZone = useCallback(
    (bellowElem: null | HTMLElement) =>
      // если курсор выходит за viewport, то bellowElem = null
      bellowElem
        ? bellowElem.dataset.dropname || bellowElem.matches('[data-anchor="pendingAnchor"]')
          ? true
          : false
        : false,
    []
  );

  const getBellowElement: GetBellowElement = useCallback((target, x, y) => {
    const matchList = ['[data-anchor="pendingAnchor"]', '.drop-zone'];

    target.classList.add('hidden');
    const bellowElem = defineElemFromPoint(matchList, [x, y]);
    target.classList.remove('hidden');

    return bellowElem ?? (document.elementFromPoint(x, y) as HTMLElement);
  }, []);

  const makeDraggableElement = () =>
    React.Children.map(children, (item) =>
      React.cloneElement(item, {
        ...item.props,
        style,
        onMouseDown: isBlockAnimaton ? null : dragStart,
      })
    );

  // HANDLER FUNCTIONS---------------------------------------------------
  const dragStart = useCallback(
    (ev: React.MouseEvent<HTMLSpanElement>) => {
      const draggableElem = ev.target as HTMLSpanElement;
      draggableElem.classList.add('draggable');
      setDragStart(true);
      setDraggableElem(draggableElem);
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
      const { clientX, clientY, target } = ev;
      const bellowElem = getBellowElement(target as HTMLElement, clientX, clientY);
      inDropArea.current = isDraggableElemInDropZone(bellowElem);
      const currentAreaName = setCurrentZone(getBellowElemDataAttr(bellowElem));

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
        x: clientX - shiftCoords.initialX - shiftCoords.shiftX,
        y: clientY - shiftCoords.initialY - shiftCoords.shiftY,
      }));
      if (bellowElem) bellowElem.ondragstart = () => false;
    },
    [
      dragMoveHandler,
      draggableElemInfo.from,
      draggableElemInfo.wordId,
      getBellowElement,
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
      const { clientX, clientY, target } = ev;
      draggableElem?.classList.remove('draggable');
      const bellowElement = getBellowElement(target as HTMLElement, clientX, clientY);
      setDragStart(false);
      setTranslateCoords(INITIAL_TRANSLATE_COORDS);

      dragEndHandler({
        from: draggableElemInfo.from,
        originId: draggableElemInfo.originId,
        dragId: draggableElemInfo.wordId,
        currentZone: currentArea.current,
        anchorId: bellowElement ? bellowElement.dataset.id : null,
      });
    },
    [
      dragEndHandler,
      draggableElem?.classList,
      draggableElemInfo.from,
      draggableElemInfo.originId,
      draggableElemInfo.wordId,
      getBellowElement,
    ]
  );

  useEffect(() => {
    if (isDragStart && !isBlockAnimaton) {
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
    [isDragStart, isTransitioned, originCoords.x, originCoords.y, translateCoords.x, translateCoords.y]
  );

  return <Fragment>{makeDraggableElement()}</Fragment>;
};

export default React.memo(Draggable);
