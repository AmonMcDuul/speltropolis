import { GameDefinition } from '../../shared/models/game-definition.model';

export const GAMES: GameDefinition[] = [
  {
    id: 'memory',
    title: 'Memory',
    icon: '🧠',
    route: '/games/memory',
    difficulties: ['easy', 'medium', 'hard'],
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    icon: '🚀',
    route: '/games/space-invaders',
  },
  {
    id: 'rekenen',
    title: 'Rekenen',
    icon: '🧮',
    route: '/games/rekenen',
  },
  {
    id: 'klokkijken',
    title: 'Klok kijken',
    icon: '🕒',
    route: '/games/klok-kijken',
  },
  {
    id: 'leren typen',
    title: 'Leren typen',
    icon: '⌨️',
    route: '/games/leren-typen',
  },
  {
    id: 'find',
    title: 'Vind de afwijkende',
    icon: '🔎',
    route: '/games/find',
  },
];
