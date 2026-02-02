import { useState } from 'react';
import { MapPin, Layers, Navigation, Target, Download, Filter } from 'lucide-react';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { mockFoundObjects } from '@/data/mockObjects';
import { FoundObject } from '@/types/objects';

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState('terrain');
  const [selectedObject, setSelectedObject] = useState<FoundObject | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Simulated GPS position
  const position = {
    latitude: 40.7496,
    longitude: 14.4847,
    altitude: 42.3,
    accuracy: 2.5,
  };

  // Filter objects based on selected type
  const filteredObjects = filterType === 'all' 
    ? mockFoundObjects 
    : mockFoundObjects.filter(obj => obj.type === filterType);

  const handleObjectClick = (object: FoundObject) => {
    setSelectedObject(object);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Map</h1>
          <p className="text-sm text-muted-foreground">Geospatial positioning and overlays</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" />
            Export KML
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 card-instrument p-3">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Слой:</span>
          {['terrain', 'satellite', 'magnetic', 'depth'].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1 text-xs uppercase tracking-wider rounded-md transition-colors ${
                activeLayer === layer
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 card-instrument p-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Фильтр:</span>
          {['all', 'artifact', 'structure', 'anomaly', 'organic'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs capitalize rounded-md transition-colors ${
                filterType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {type === 'all' ? 'Все' : type === 'artifact' ? 'Артефакты' : type === 'structure' ? 'Структуры' : type === 'anomaly' ? 'Аномалии' : 'Органика'}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map */}
      <div className="flex-1 min-h-[400px]">
        <InteractiveMap 
          objects={filteredObjects} 
          onObjectClick={handleObjectClick}
          className="w-full h-full"
        />
      </div>

      {/* Selected Object Details */}
      {selectedObject && (
        <div className="card-instrument p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{selectedObject.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedObject.description}</p>
            </div>
            <button
              onClick={() => setSelectedObject(null)}
              className="text-muted-foreground hover:text-foreground text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">ID</div>
              <div className="font-mono-data text-sm text-foreground">{selectedObject.id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Тип</div>
              <div className="text-sm text-foreground capitalize">{selectedObject.type}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Глубина</div>
              <div className="font-mono-data text-sm text-foreground">{selectedObject.depth}м</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Уверенность</div>
              <div className={`font-mono-data text-sm ${
                selectedObject.confidence > 80 ? 'text-status-success' : 
                selectedObject.confidence > 60 ? 'text-status-warning' : 'text-status-error'
              }`}>
                {selectedObject.confidence}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Материал</div>
              <div className="text-sm text-foreground">{selectedObject.properties.material || 'Неизвестно'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Эпоха</div>
              <div className="text-sm text-foreground">{selectedObject.properties.era || 'Неизвестна'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Размер</div>
              <div className="text-sm text-foreground">{selectedObject.properties.size || 'Неизвестен'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Обнаружен</div>
              <div className="font-mono-data text-sm text-foreground">
                {selectedObject.discoveredAt.toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
