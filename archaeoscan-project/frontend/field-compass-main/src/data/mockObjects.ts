import { FoundObject } from '@/types/objects';

export const mockFoundObjects: FoundObject[] = [
  {
    id: 'OBJ-001',
    name: 'Древняя монета',
    type: 'artifact',
    latitude: 40.7496,
    longitude: 14.4847,
    depth: 0.8,
    confidence: 94,
    description: 'Римская монета времен императора Августа',
    discoveredAt: new Date('2024-01-15T10:30:00'),
    properties: {
      material: 'Бронза',
      era: 'Римская империя',
      size: '2.5 см',
      condition: 'Хорошее'
    }
  },
  {
    id: 'OBJ-002',
    name: 'Керамический сосуд',
    type: 'artifact',
    latitude: 40.7502,
    longitude: 14.4851,
    depth: 1.2,
    confidence: 87,
    description: 'Фрагмент древнегреческого амфоры',
    discoveredAt: new Date('2024-01-15T11:45:00'),
    properties: {
      material: 'Керамика',
      era: 'Древняя Греция',
      size: '15 см',
      condition: 'Фрагмент'
    }
  },
  {
    id: 'OBJ-003',
    name: 'Каменная структура',
    type: 'structure',
    latitude: 40.7489,
    longitude: 14.4842,
    depth: 2.5,
    confidence: 92,
    description: 'Основание древней стены или фундамента',
    discoveredAt: new Date('2024-01-15T13:20:00'),
    properties: {
      material: 'Песчаник',
      era: 'Неизвестна',
      size: '3м x 1м',
      condition: 'Разрушена'
    }
  },
  {
    id: 'OBJ-004',
    name: 'Металлическая аномалия',
    type: 'anomaly',
    latitude: 40.7511,
    longitude: 14.4863,
    depth: 1.8,
    confidence: 76,
    description: 'Неопознанный металлический объект',
    discoveredAt: new Date('2024-01-15T14:10:00'),
    properties: {
      material: 'Металл',
      era: 'Неизвестна',
      size: '30 см',
      condition: 'Неизвестно'
    }
  },
  {
    id: 'OBJ-005',
    name: 'Органические остатки',
    type: 'organic',
    latitude: 40.7498,
    longitude: 14.4855,
    depth: 0.5,
    confidence: 68,
    description: 'Следы органического материала',
    discoveredAt: new Date('2024-01-15T15:30:00'),
    properties: {
      material: 'Органика',
      era: 'Неизвестна',
      size: '10 см',
      condition: 'Разложение'
    }
  },
  {
    id: 'OBJ-006',
    name: 'Бронзовая статуэтка',
    type: 'artifact',
    latitude: 40.7505,
    longitude: 14.4838,
    depth: 1.5,
    confidence: 89,
    description: 'Маленькая бронзовая фигурка',
    discoveredAt: new Date('2024-01-15T16:45:00'),
    properties: {
      material: 'Бронза',
      era: 'Эллинистический период',
      size: '8 см',
      condition: 'Удовлетворительное'
    }
  }
];
