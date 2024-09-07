import { TILE_SIZE } from '../constants/constants';
import { mapWidth } from '../constants/map';

export const calcMapPos = (num: number) => num - (num % TILE_SIZE);

export const coordsToMapIndex = (x: number, y: number) => {
  const tileX = Math.floor(x / TILE_SIZE);
  const tileY = Math.floor(y / TILE_SIZE);

  return tileY * mapWidth + tileX;
};
