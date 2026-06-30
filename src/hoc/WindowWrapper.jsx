import useWindowStore from '#/store/Window'
import React from 'react'
import { useRef, useLayoutEffect } from 'react'
import {useGSAP} from "@gsap/react";
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) =>{
    const {focusWindow, windows} = useWindowStore();
    const {isOpen, zIndex} = windows[windowKey];
    const ref = useRef(null);

    useGSAP(() => {
      const e = ref.current;
      if(!e || !isOpen)
          return;
      
      e.style.display = "block";
      gsap.fromTo(e, 
        {scale: 0.8, opacity : 0, y : 40},
        {scale : 1, opacity : 1, y : 0, duration : 0.3, ease : "power3.out"}
      );
    }, [isOpen]);

    useGSAP(() => {
      const e = ref.current;
      if(!e)
        return ()=>{};

      const [instance] = Draggable.create(e,
        {onPress : () =>focusWindow(windowKey)}
      );

      return () => instance.kill();
    }, []);

    useLayoutEffect(() => {
      const e = ref.current;
      if(!e)
        return;

      e.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

    return (
      <section 
        id={windowKey} 
        ref={ref} 
        style={{zIndex}} 
        className='absolute'>
          <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
}

export default WindowWrapper
