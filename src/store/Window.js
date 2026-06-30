import { WINDOW_CONFIG, INITIAL_Z_INDEX } from "#/constants";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

const useWindowStore = create(immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX+1,
    openWindow: (windowKey, data=null) => set((state) =>{
        const win = state.windows[windowKey];
        if(!win)
            return;
        win.isOpen = true;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex += 1;
    }),
    hideWindow: (windowKey) => set((state) =>{
        const win = state.windows[windowKey];
        if(!win)
            return;

        win.isOpen = false;
        win.isMinimized = false;
    }),
    closeWindow: (windowKey, data=null) => set((state) =>{
        const win = state.windows[windowKey];
        if(!win)
            return;
        win.isOpen = false;
        win.isMinimized = false;
        win.isMaximized = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
        win.dimensions = null;
        win.restoreGeometry = null;
    }),
    focusWindow: (windowKey) => set((state) =>{
        const win = state.windows[windowKey];
        if(!win)
            return;
        win.zIndex = state.nextZIndex;
        state.nextZIndex += 1;
    }),
    resizeWindow: (windowKey, dimensions) => set((state) => {
        const win = state.windows[windowKey];
        if(!win)
            return;

        if(win.isMaximized)
            return;

        win.dimensions = dimensions;
    }),
    minimizeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if(!win)
            return;

        win.isMinimized = true;
    }),
    maximizeWindow: (windowKey, restoreGeometry) => set((state) => {
        const win = state.windows[windowKey];
        if(!win)
            return;

        win.isMaximized = true;
        win.isMinimized = false;
        win.restoreGeometry = restoreGeometry;
    }),
    restoreWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if(!win)
            return;

        win.isMaximized = false;
        win.isMinimized = false;
        win.restoreGeometry = null;
    }),
})));

export default useWindowStore;