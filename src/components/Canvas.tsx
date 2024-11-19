import React, { useState, useRef, useCallback } from 'react';
import { Node } from './Node';
import { NodeConnector } from './NodeConnector';
import { CanvasControls } from './CanvasControls';
import { useZoom } from '../hooks/useZoom';
import { useCanvasTools } from '../hooks/useCanvasTools';
import type { Node as NodeType, Point } from '../types';

const SAMPLE_NODES: NodeType[] = [
  {
    id: '1',
    title: 'Started Programming',
    content: 'My journey into the world of coding began here...',
    type: 'moment',
    isPrivate: false,
    position: { x: 400, y: 300 },
    connections: ['2'],
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2020-01-01'),
    mediaUrls: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6']
  },
  {
    id: '2',
    title: 'First Tech Job',
    content: 'Landed my dream position as a software developer',
    type: 'experience',
    isPrivate: false,
    position: { x: 600, y: 400 },
    connections: ['1'],
    createdAt: new Date('2021-06-15'),
    updatedAt: new Date('2021-06-15')
  }
];

interface DragState {
  nodeId: string;
  startX: number;
  startY: number;
  originalX: number;
  originalY: number;
}

export function Canvas() {
  const [nodes, setNodes] = useState<NodeType[]>(SAMPLE_NODES);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { viewport, handleZoom, resetView, setViewport } = useZoom();
  const {
    isPanToolActive,
    isPanning,
    togglePanTool,
    startPanning,
    updatePanning,
    stopPanning
  } = useCanvasTools(setViewport);

  const handleDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    if (isPanToolActive) return;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDragState({
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      originalX: node.position.x,
      originalY: node.position.y
    });
  }, [nodes, isPanToolActive]);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    updatePanning(e);

    if (!dragState || isPanning) return;

    const deltaX = (e.clientX - dragState.startX) / viewport.scale;
    const deltaY = (e.clientY - dragState.startY) / viewport.scale;

    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === dragState.nodeId) {
        return {
          ...node,
          position: {
            x: dragState.originalX + deltaX,
            y: dragState.originalY + deltaY
          }
        };
      }
      return node;
    }));
  }, [dragState, viewport.scale, isPanning, updatePanning]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    handleZoom(delta, e.clientX, e.clientY);
  }, [handleZoom]);

  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    setFocusedNode(nodeId);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-gray-50"
      onMouseDown={startPanning}
      onMouseMove={handleDragMove}
      onMouseUp={() => {
        stopPanning();
        setDragState(null);
      }}
      onMouseLeave={() => {
        stopPanning();
        setDragState(null);
      }}
      onClick={() => {
        if (!isPanning && !isPanToolActive) {
          setSelectedNode(null);
          setFocusedNode(null);
        }
      }}
      onWheel={handleWheel}
      style={{ cursor: isPanToolActive ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
    >
      <div
        className="absolute inset-0 transition-transform duration-300 ease-in-out"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map(node => 
            node.connections.map(targetId => {
              const target = nodes.find(n => n.id === targetId);
              if (!target) return null;

              return (
                <NodeConnector
                  key={`${node.id}-${targetId}`}
                  source={node.position}
                  target={target.position}
                  isSelected={selectedNode === node.id}
                  scale={viewport.scale}
                />
              );
            })
          )}
        </svg>
        
        {nodes.map(node => (
          <Node
            key={node.id}
            node={node}
            onNodeClick={(id) => {
              if (!isPanning && !isPanToolActive) {
                setSelectedNode(id === selectedNode ? null : id);
              }
            }}
            onNodeDoubleClick={handleNodeDoubleClick}
            onDragStart={(e) => handleDragStart(node.id, e)}
            isSelected={selectedNode === node.id}
            isFocused={focusedNode === node.id}
            isOtherNodeSelected={selectedNode !== null && selectedNode !== node.id}
            scale={viewport.scale}
          />
        ))}
      </div>

      <CanvasControls
        scale={viewport.scale}
        onZoomIn={() => handleZoom(0.25)}
        onZoomOut={() => handleZoom(-0.25)}
        onReset={resetView}
        isPanning={isPanToolActive}
        onTogglePan={togglePanTool}
      />
    </div>
  );
}