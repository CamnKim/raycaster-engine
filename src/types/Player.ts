/* eslint-disable prefer-destructuring */

import map from '../constants/map';
import { calcMapPos, coordsToMapIndex } from '../utils/mapUtils';

class Player {
  // Player pos
  x: number;

  y: number;

  dirX: number; // Player direction x

  dirY: number; // Player direction y

  private speed: number = 20;

  private rotSpeed: number = 0.1;

  constructor(px: number, py: number) {
    // set position
    this.x = px;
    this.y = py;

    this.dirX = 1;
    this.dirY = 0;
  }

  getSpeed(): number {
    return this.speed;
  }

  /**
   *
   * @param dir Direction to rotate (+1 for right, -1 for left)
   */
  rotate(dir: 1 | -1): void {
    if (dir > 0) {
      const oldDirX = this.dirX;
      this.dirX = this.dirX * Math.cos(-this.rotSpeed) - this.dirY * Math.sin(-this.rotSpeed);
      this.dirY = oldDirX * Math.sin(-this.rotSpeed) + this.dirY * Math.cos(-this.rotSpeed);
    } else {
      const oldDirX = this.dirX;
      this.dirX = this.dirX * Math.cos(this.rotSpeed) - this.dirY * Math.sin(this.rotSpeed);
      this.dirY = oldDirX * Math.sin(this.rotSpeed) + this.dirY * Math.cos(this.rotSpeed);
    }
  }

  movePlayer(dir: 'left' | 'right' | 'up' | 'down') {
    if (dir === 'left') {
      this.rotate(-1);
    }
    if (dir === 'right') {
      this.rotate(1);
    }
    if (dir === 'up') {
      const newX = this.x + this.dirX;
      const newY = this.y + this.dirY;
      const mapX = calcMapPos(newX);
      const mapY = calcMapPos(newY);

      if (map[coordsToMapIndex(mapX, mapY)] === 0) {
        this.x = newX;
        this.y = newY;
      }
    }
    if (dir === 'down') {
      this.x -= this.dirX;
      this.y -= this.dirY;
    }
  }
}

export default Player;
