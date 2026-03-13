import { GAME_REGISTRY } from '../src/app/features/games/game.registry.js';

const routes = ['/', ...GAME_REGISTRY.map((g) => g.route)];

console.log(JSON.stringify(routes));
