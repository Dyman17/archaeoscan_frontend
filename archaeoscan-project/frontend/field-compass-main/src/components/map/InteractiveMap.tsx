import { useState, useRef, useEffect } from 'react';
import { FoundObject } from '@/types/objects';
import { MapPin, ZoomIn, ZoomOut, Navigation, Layers } from 'lucide-react';

interface InteractiveMapProps {
  objects: FoundObject[];
  onObjectClick?: (object: FoundObject) => void;
  className?: string;
}

export function InteractiveMap({ objects, onObjectClick, className }: InteractiveMapProps) {
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState({ lat: 40.7496, lng: 14.4847 });
  const [selectedObject, setSelectedObject] = useState<FoundObject | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert lat/lng to canvas coordinates
  const latLngToCanvas = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng - center.lng) * Math.cos(center.lat * Math.PI / 180) * 111320 * Math.pow(2, zoom) / 256) + width / 2;
    const y = ((center.lat - lat) * 111320 * Math.pow(2, zoom) / 256) + height / 2;
    return { x, y };
  };

  // Draw map and objects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw terrain features (simulated)
    ctx.fillStyle = '#0f1419';
    ctx.fillRect(0, 0, width, height);

    // Draw contour lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 50 + i * 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw objects
    objects.forEach(obj => {
      const pos = latLngToCanvas(obj.latitude, obj.longitude, width, height);
      
      if (pos.x >= 0 && pos.x <= width && pos.y >= 0 && pos.y <= height) {
        // Draw marker
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
        
        // Color based on object type
        switch (obj.type) {
          case 'artifact':
            ctx.fillStyle = '#f59e0b';
            break;
          case 'structure':
            ctx.fillStyle = '#3b82f6';
            break;
          case 'anomaly':
            ctx.fillStyle = '#ef4444';
            break;
          case 'organic':
            ctx.fillStyle = '#10b981';
            break;
          default:
            ctx.fillStyle = '#6b7280';
        }
        
        ctx.fill();
        
        // Draw confidence ring
        ctx.strokeStyle = obj.confidence > 80 ? '#10b981' : obj.confidence > 60 ? '#f59e0b' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obj.id, pos.x, pos.y - 15);
      }
    });

    // Draw center crosshair
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 10, height / 2);
    ctx.lineTo(width / 2 + 10, height / 2);
    ctx.moveTo(width / 2, height / 2 - 10);
    ctx.lineTo(width / 2, height / 2 + 10);
    ctx.stroke();

  }, [objects, center, zoom, showGrid]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is on any object
    objects.forEach(obj => {
      const pos = latLngToCanvas(obj.latitude, obj.longitude, canvas.width, canvas.height);
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      
      if (distance <= 12) {
        setSelectedObject(obj);
        onObjectClick?.(obj);
      }
    });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 20));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1));

  return (
    <div className={`relative bg-background border border-border rounded-lg overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
      />
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-background/80 border border-border rounded-md hover:bg-background transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-background/80 border border-border rounded-md hover:bg-background transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="p-2 bg-background/80 border border-border rounded-md hover:bg-background transition-colors"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCenter({ lat: 40.7496, lng: 14.4847 })}
          className="p-2 bg-background/80 border border-border rounded-md hover:bg-background transition-colors"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Object details popup */}
      {selectedObject && (
        <div className="absolute bottom-4 left-4 bg-background/95 border border-border rounded-lg p-4 max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground">{selectedObject.name}</h3>
            <button
              onClick={() => setSelectedObject(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono">{selectedObject.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Тип:</span>
              <span>{selectedObject.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Глубина:</span>
              <span>{selectedObject.depth}м</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Уверенность:</span>
              <span className={selectedObject.confidence > 80 ? 'text-status-success' : selectedObject.confidence > 60 ? 'text-status-warning' : 'text-status-error'}>
                {selectedObject.confidence}%
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-muted-foreground text-xs">{selectedObject.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-background/95 border border-border rounded-lg p-3">
        <h4 className="text-sm font-semibold mb-2">Легенда</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Артефакт</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Структура</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Аномалия</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Органика</span>
          </div>
        </div>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 right-4 bg-background/95 border border-border rounded px-2 py-1">
        <span className="text-xs font-mono">Масштаб: 1:{Math.pow(2, zoom) * 1000}</span>
      </div>
    </div>
  );
}
