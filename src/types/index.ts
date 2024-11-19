export interface Node {
  id: string;
  title: string;
  content: string;
  type: 'moment' | 'idea' | 'project' | 'experience';
  isPrivate: boolean;
  position: Point;
  connections: string[];
  createdAt: Date;
  updatedAt: Date;
  mediaUrls?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface ViewportState {
  scale: number;
  x: number;
  y: number;
}