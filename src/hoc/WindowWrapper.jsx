import useWindowStore from '#/store/Window'
import React from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import {useGSAP} from "@gsap/react";
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) =>{
    const {focusWindow, resizeWindow, windows} = useWindowStore();
    const {isOpen, zIndex, dimensions, isMaximized} = windows[windowKey];
    const ref = useRef(null);
    const resizeStateRef = useRef(null);
    const isResizingRef = useRef(false);
    const draggableRef = useRef(null);

    useGSAP(() => {
      const e = ref.current;
      if(!e || !isOpen)
          return;
      
      e.style.display = "block";
      gsap.fromTo(e, 
        {scale: 0.92, opacity : 0, y : 18},
        {scale : 1, opacity : 1, y : 0, duration : 0.28, ease : "power3.out"}
      );
    }, [isOpen]);

    useGSAP(() => {
      const e = ref.current;
      if(!e)
        return ()=>{};

      const [instance] = Draggable.create(e,
        {
          type: 'x,y',
          onPress : () =>focusWindow(windowKey),
          cancel: '.window-resize-handle',
        }
      );

      draggableRef.current = instance;

      return () => instance.kill();
    }, []);

    useEffect(() => {
      if(!draggableRef.current)
        return;

      if(isMaximized)
        draggableRef.current.disable();
      else
        draggableRef.current.enable();
    }, [isMaximized]);

    useEffect(() => {
      const handlePointerMove = (event) => {
        const resizeState = resizeStateRef.current;
        if(!resizeState)
          return;

        const nextWidth = Math.max(resizeState.minWidth, resizeState.startWidth + (event.clientX - resizeState.startX));
        const nextHeight = Math.max(resizeState.minHeight, resizeState.startHeight + (event.clientY - resizeState.startY));

        resizeWindow(windowKey, {
          width: nextWidth,
          height: nextHeight,
        });
      };

      const handlePointerUp = () => {
        resizeStateRef.current = null;
        isResizingRef.current = false;

        if(!isMaximized)
          draggableRef.current?.enable();
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }, [resizeWindow, windowKey]);

    useLayoutEffect(() => {
      const e = ref.current;
      if(!e)
        return;

      e.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

    const handleResizeStart = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const e = ref.current;
      if(!e)
        return;

      focusWindow(windowKey);

      isResizingRef.current = true;
      draggableRef.current?.disable();

      const bounds = e.getBoundingClientRect();
      resizeStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startWidth: bounds.width,
        startHeight: bounds.height,
        minWidth: Math.max(320, bounds.width * 0.5),
        minHeight: Math.max(240, bounds.height * 0.5),
      };

      event.currentTarget.setPointerCapture?.(event.pointerId);
    };

    return (
      <section 
        id={windowKey} 
        ref={ref} 
        style={{
          zIndex,
          width: isMaximized ? '100dvw' : dimensions?.width,
          height: isMaximized ? '100dvh' : dimensions?.height,
          maxHeight: isMaximized ? '100dvh' : '82dvh',
          top: isMaximized ? 0 : undefined,
          left: isMaximized ? 0 : undefined,
          borderRadius: isMaximized ? 0 : undefined,
        }} 
        className='absolute overflow-y-auto overflow-x-hidden'>
          <Component {...props} />
          {!isMaximized && (
            <button
              type='button'
              aria-label={`Resize ${windowKey} window`}
              className='window-resize-handle'
              onPointerDown={handleResizeStart}
            />
          )}
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
}

export default WindowWrapper
