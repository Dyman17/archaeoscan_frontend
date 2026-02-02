export interface FoundObject {
  id: string;
  name: string;
  type: 'artifact' | 'structure' | 'anomaly' | 'organic';
  latitude: number;
  longitude: number;
  depth: number;
  confidence: number;
  description: string;
  discoveredAt: Date;
  properties: {
    material?: string;
    era?: string;
    size?: string;
    condition?: string;
  };
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
