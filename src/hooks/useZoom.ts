import { useState, useCallback } from 'react';
import type { ViewportState } from '../types';

export function useZoom(minScale = 0.25, maxScale = 2) {
  const [viewport, setViewport] = useState<ViewportState>({ scale: 1, x: 0, y: 0 });

  const handleZoom = useCallback((delta: number, clientX?: number, clientY?: number) => {
    setViewport(prev => {
      const newScale = Math.min(Math.max(minScale, prev.scale + delta), maxScale);
      
      // If mouse position is provided, zoom towards that point
      if (clientX !== undefined && clientY !== undefined) {
        const scaleChange = newScale - prev.scale;
        
        // Calculate how much the viewport should shift to zoom towards the mouse
        const mouseXFromCenter = clientX - window.innerWidth / 2;
        const mouseYFromCenter = clientY - window.innerHeight / 2;
        
        return {
          scale: newScale,
          x: prev.x - mouseXFromCenter * (scaleChange / prev.scale),
          y: prev.y - mouseYFromCenter * (scaleChange / prev.scale)
        };
      }
      
      return { ...prev, scale: newScale };
    });
  }, [minScale, maxScale]);

  const resetView = useCallback(() => {
    setViewport({ scale: 1, x: 0, y: 0 });
  }, []);

  return { viewport, handleZoom, resetView, setViewport };
}