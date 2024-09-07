const vecRotate = (dirVec: [number, number], rotDir: 1 | -1, angle: number) => {
  const [dirX, dirY] = dirVec;
  let newX: number;
  let newY: number;
  if (rotDir > 0) {
    const oldDirX = dirX;
    newX = dirX * Math.cos(-angle) - dirY * Math.sin(-angle);
    newY = oldDirX * Math.sin(-angle) + dirY * Math.cos(-angle);
  } else {
    const oldDirX = dirX;
    newX = dirX * Math.cos(angle) - dirY * Math.sin(angle);
    newY = oldDirX * Math.sin(angle) + dirY * Math.cos(angle);
  }

  return {
    x: newX,
    y: newY,
  };
};
export default vecRotate;
