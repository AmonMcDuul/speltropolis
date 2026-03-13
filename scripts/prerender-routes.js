import fs from 'fs';

const registry = JSON.parse(fs.readFileSync('./src/app/features/games/game.registry.json', 'utf8'));

const routes = ['/', ...registry.map((g) => g.route)];

console.log(JSON.stringify(routes));
