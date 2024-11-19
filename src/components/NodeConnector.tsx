import React from 'react';
import type { Point } from '../types';

interface NodeConnectorProps {
  source: Point;
  target: Point;
  isSelected: boolean;
  scale: number;
}

export function NodeConnector({ source, target, isSelected, scale }: NodeConnectorProps) {
  const color = isSelected ? '#60A5FA' : '#CBD5E1';
  const strokeWidth = 2 / scale; // Scale stroke width inversely to maintain visual consistency

  return (
    <path
      d={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
      stroke={color}
      strokeWidth={strokeWidth}
      className="transition-colors duration-200"
    />
  );
}