import React from 'react'
import useWindowStore from '#/store/Window'
import gsap from 'gsap'

const WindowControls = ({ target }) => {
  const {
    focusWindow,
    closeWindow,
    hideWindow,
    maximizeWindow,
    minimizeWindow,
    restoreWindow,
    windows,
  } = useWindowStore();
  const windowState = windows[target];

  const getWindowNode = () => document.getElementById(target);

  const animateWindow = (node, animation, onComplete) => {
    if(!node)
      return;

    gsap.killTweensOf(node);
    gsap.to(node, {
      duration: 0.28,
      ease: 'power3.inOut',
      ...animation,
      onComplete,
    });
  };

  const handleMinimize = () => {
    const node = getWindowNode();
    if(!node)
      return;

    focusWindow(target);
    minimizeWindow(target);

    const dock = document.getElementById('dock');
    const dockRect = dock?.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const currentX = gsap.getProperty(node, 'x') || 0;
    const currentY = gsap.getProperty(node, 'y') || 0;
    const targetCenterX = dockRect ? dockRect.left + dockRect.width / 2 : window.innerWidth / 2;
    const targetCenterY = dockRect ? dockRect.top + dockRect.height / 2 : window.innerHeight - 40;
    const windowCenterX = nodeRect.left + nodeRect.width / 2;
    const windowCenterY = nodeRect.top + nodeRect.height / 2;

    animateWindow(node, {
      x: currentX + (targetCenterX - windowCenterX),
      y: currentY + (targetCenterY - windowCenterY),
      scale: 0.15,
      opacity: 0,
      transformOrigin: 'center center',
    }, () => hideWindow(target));
  };

  const handleMaximize = () => {
    const node = getWindowNode();
    if(!node)
      return;

    focusWindow(target);

    if(windowState?.isMaximized) {
      const restoreGeometry = windowState.restoreGeometry;
      if(!restoreGeometry)
        return;

      animateWindow(node, {
        x: restoreGeometry.x,
        y: restoreGeometry.y,
        width: restoreGeometry.width,
        height: restoreGeometry.height,
        borderRadius: '0.75rem',
      }, () => restoreWindow(target));
      return;
    }

    const rect = node.getBoundingClientRect();
    const currentX = gsap.getProperty(node, 'x') || 0;
    const currentY = gsap.getProperty(node, 'y') || 0;
    const restoreGeometry = {
      x: currentX,
      y: currentY,
      width: rect.width,
      height: rect.height,
    };

    animateWindow(node, {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: '0px',
    }, () => maximizeWindow(target, restoreGeometry));
  };

  const handleClose = () => {
    const node = getWindowNode();
    if(!node) {
      closeWindow(target);
      return;
    }

    animateWindow(node, {
      scale: 0.92,
      opacity: 0,
      y: 16,
      transformOrigin: 'center center',
    }, () => closeWindow(target));
  };

  return (
    <div id='window-controls'>
    <button type='button' aria-label='Close window' data-label='Close' className='close' onClick={handleClose}/>
    <button type='button' aria-label='Minimize window' data-label='Minimize' className='minimize' onClick={handleMinimize}/>
    <button
      type='button'
      aria-label={windowState?.isMaximized ? 'Restore window' : 'Maximize window'}
      data-label={windowState?.isMaximized ? 'Restore' : 'Maximize'}
      className='maximize'
      onClick={handleMaximize}
    />
    </div>
  )
}

export default WindowControls
