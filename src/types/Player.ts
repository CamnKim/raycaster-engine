class Player {
  // Player pos
  px: number;

  py: number;

  pdx: number; // Player delta x pos

  pdy: number; // Player delta y pos

  pa: number; // Player angle

  private speed: number = 5;

  constructor(px: number, py: number) {
    // set position
    this.px = px;
    this.py = py;

    // set angle
    this.pa = 0;

    this.pdx = Math.sin(this.pa) * this.speed;
    this.pdy = Math.cos(this.pa) * this.speed;
  }

  getSpeed(): number {
    return this.speed;
  }
}

export default Player;
