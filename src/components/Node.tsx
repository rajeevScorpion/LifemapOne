import React from 'react';
import { MoreHorizontal, Lock, Unlock, Image, Video, Link as LinkIcon } from 'lucide-react';
import type { Node as NodeType } from '../types';

interface NodeProps {
  node: NodeType;
  onNodeClick: (id: string) => void;
  onNodeDoubleClick: (id: string) => void;
  onDragStart: (e: React.MouseEvent) => void;
  isSelected: boolean;
  isOtherNodeSelected: boolean;
  isFocused: boolean;
  scale: number;
}

export function Node({ 
  node, 
  onNodeClick, 
  onNodeDoubleClick,
  onDragStart, 
  isSelected,
  isOtherNodeSelected,
  isFocused,
  scale 
}: NodeProps) {
  const hasMedia = node.mediaUrls && node.mediaUrls.length > 0;
  const nodeScale = isFocused ? 2 : isSelected ? 1.05 : 1;

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-64 cursor-move transition-all duration-300 ease-in-out
        ${isSelected || isFocused ? 'z-50' : 'z-10'}
        ${isOtherNodeSelected ? 'opacity-60 blur-[1px]' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: `translate(-50%, -50%) scale(${nodeScale / scale})`
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onDragStart(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onNodeClick(node.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onNodeDoubleClick(node.id);
      }}
    >
      <div
        className={`bg-white rounded-xl transition-all duration-200 overflow-hidden
          ${(isSelected || isFocused)
            ? 'ring-2 ring-blue-500 shadow-2xl' 
            : 'shadow-lg hover:shadow-xl'}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 truncate">{node.title}</h3>
            <div className="flex items-center space-x-2">
              {node.isPrivate ? (
                <Lock className="w-4 h-4 text-gray-500" />
              ) : (
                <Unlock className="w-4 h-4 text-gray-500" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {node.content}
          </p>

          {hasMedia && (
            <div className="flex space-x-2 mb-2">
              <Image className="w-4 h-4 text-blue-500" />
              <Video className="w-4 h-4 text-blue-500" />
              <LinkIcon className="w-4 h-4 text-blue-500" />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(node.createdAt).toLocaleDateString()}</span>
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {node.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}