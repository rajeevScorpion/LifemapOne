import { useState, useCallback } from 'react';
import type { ViewportState } from '../types';

interface PanState {
  isPanning: boolean;
  startX: number;
  startY: number;
}

export function useCanvasTools(setViewport: (updater: (prev: ViewportState) => ViewportState) => void) {
  const [isPanToolActive, setIsPanToolActive] = useState(false);
  const [panState, setPanState] = useState<PanState | null>(null);

  const startPanning = useCallback((e: React.MouseEvent) => {
    if (isPanToolActive && e.button === 0) {
      e.preventDefault();
      document.body.style.cursor = 'grabbing';
      setPanState({
        isPanning: true,
        startX: e.clientX,
        startY: e.clientY
      });
    }
  }, [isPanToolActive]);

  const updatePanning = useCallback((e: React.MouseEvent) => {
    if (panState?.isPanning) {
      const deltaX = e.clientX - panState.startX;
      const deltaY = e.clientY - panState.startY;
      
      setViewport(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      setPanState({
        isPanning: true,
        startX: e.clientX,
        startY: e.clientY
      });
    }
  }, [panState, setViewport]);

  const stopPanning = useCallback(() => {
    if (panState?.isPanning) {
      document.body.style.cursor = isPanToolActive ? 'grab' : 'default';
      setPanState(null);
    }
  }, [panState, isPanToolActive]);

  const togglePanTool = useCallback(() => {
    setIsPanToolActive(prev => !prev);
    document.body.style.cursor = isPanToolActive ? 'default' : 'grab';
  }, [isPanToolActive]);

  return {
    isPanToolActive,
    isPanning: panState?.isPanning || false,
    togglePanTool,
    startPanning,
    updatePanning,
    stopPanning
  };
}