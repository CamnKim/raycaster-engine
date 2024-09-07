import map from '../../constants/map';
import Player from '../../types/Player';
import { Color, WebGLContext } from '../../types/types';
import drawLine from './drawLine';
import vecRotate from '../math/vecRotate';
import { calcMapPos, coordsToMapIndex } from '../mapUtils';

const canvas = document.querySelector('#view');

if (!canvas) {
  throw new Error('No canvas element');
}

const screenHeight = canvas.clientHeight;

const dda = (dir: [number, number], player: Player) => {
  const rayDirX = dir[0];
  const rayDirY = dir[1];

  let mapX = calcMapPos(player.x);
  let mapY = calcMapPos(player.y);

  const deltaDistX = rayDirX !== 0 ? Math.abs(1 / rayDirX) : 100;
  const deltaDistY = rayDirY !== 0 ? Math.abs(1 / rayDirY) : 100;

  let stepX: number;
  let stepY: number;

  let sideDistX: number;
  let sideDistY: number;

  let dist: number = 0;
  let hit: number = 0;

  let side: number = 0;

  // calc X step
  if (rayDirX < 0) {
    stepX = -1;
    sideDistX = (player.x - mapX) * deltaDistX;
  } else {
    stepX = 1;
    sideDistX = (mapX + 1 - player.x) * deltaDistX;
  }
  // calc Y step
  if (rayDirY < 0) {
    stepY = -1;
    sideDistY = (player.y - mapY) * deltaDistY;
  } else {
    stepY = 1;
    sideDistY = (mapY + 1 - player.y) * deltaDistY;
  }

  while (hit === 0) {
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      mapX += stepX;
      side = 0;
    } else {
      sideDistY += deltaDistY;
      mapY += stepY;
      side = 1;
    }

    const mapIndex = coordsToMapIndex(mapX, mapY);
    if (map[mapIndex] > 0) {
      hit = map[mapIndex];
    }
  }

  let hitX = player.x;
  let hitY = player.y;
  if (side === 0) {
    dist = sideDistX - deltaDistX;
    hitX = mapX;
    hitY = mapY + (1 - stepY) / 2;
  } else {
    dist = sideDistY - deltaDistY;
    hitY = mapY;
    hitX = mapX + (1 - stepX) / 2;
  }

  return {
    dist, side, x: hitX, y: hitY, hit,
  };
};

const colorMap = {
  red: {
    0: { r: 1, g: 0, b: 0 },
    1: { r: 0.7, g: 0, b: 0 },
  },
  green: {
    0: { r: 0, g: 1, b: 0 },
    1: { r: 0, g: 0.7, b: 0 },
  },
  blue: {
    0: { r: 0, g: 0, b: 1 },
    1: { r: 0, g: 0, b: 0.7 },
  },
};

const getWallColor = (hit: number, side: number) => {
  if (hit === 2) {
    return colorMap.red[side as 0 | 1];
  }
  if (hit === 1) {
    return colorMap.blue[side as 0 | 1];
  }
  return colorMap.green[side as 0 | 1];
};

const castRays = (
  glContext: WebGLContext,
  player: Player,
  drawRect: (
    sectorIndex: number,
    height: number,
    color: Color,
  ) => void,
  numSectors: number,
) => {
  const angleInterval = 0.0174533;
  let rayDir = vecRotate([player.dirX, player.dirY], -1, angleInterval * 48);

  for (let i = 0; i < numSectors; i++) {
    const ray = dda([rayDir.x, rayDir.y], player);
    drawLine(glContext, [player.x, player.y], [ray.x, ray.y], [0, 1, 0]);
    const rayH = (screenHeight / ray.dist);

    const height = rayH * 75;

    drawRect(i, height > screenHeight ? screenHeight : height, getWallColor(ray.hit, ray.side));

    rayDir = vecRotate([rayDir.x, rayDir.y], 1, angleInterval);
  }
};

export default castRays;
