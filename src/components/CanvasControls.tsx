import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Hand } from 'lucide-react';

interface CanvasControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  isPanning: boolean;
  onTogglePan: () => void;
}

export function CanvasControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
  isPanning,
  onTogglePan
}: CanvasControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
      <button
        onClick={onZoomIn}
        disabled={scale >= 2}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom in"
      >
        <ZoomIn className="w-5 h-5 text-gray-600" />
      </button>
      
      <div className="px-2 py-1 text-sm text-center text-gray-600 border-t border-b border-gray-100">
        {Math.round(scale * 100)}%
      </div>
      
      <button
        onClick={onZoomOut}
        disabled={scale <= 0.25}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom out"
      >
        <ZoomOut className="w-5 h-5 text-gray-600" />
      </button>
      
      <button
        onClick={onReset}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Reset view"
      >
        <Maximize2 className="w-5 h-5 text-gray-600" />
      </button>

      <button
        onClick={onTogglePan}
        className={`p-2 rounded-lg transition-colors ${
          isPanning ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Pan tool"
      >
        <Hand className="w-5 h-5" />
      </button>
    </div>
  );
}