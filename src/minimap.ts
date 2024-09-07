import { compileShader, createProgram, webGLInit } from './utils/webgl/utils';
import vertexShaderSource from './shaders/pointVert.glsl?raw';
import fragmentShaderSource from './shaders/fragmentShader.glsl?raw';
import map, { mapHeight, mapWidth } from './constants/map';
import { Color, WebGLContext } from './types/types';
import drawQuad from './utils/webgl/drawQuad';
import drawLine from './utils/webgl/drawLine';
import drawPoint from './utils/webgl/drawPoint';
import Player from './types/Player';
import { TILE_SIZE } from './constants/constants';
import castRays from './utils/webgl/castRay';

enum Controls {
  Left = 'KeyA',
  Right = 'KeyD',
  Up = 'KeyW',
  Down = 'KeyS',
}

const setup = () => {
  const gl = webGLInit('#minimap', [0.25, 0.25, 0.25, 0.25]);
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

  const program = createProgram(gl, vertexShader, fragmentShader);

  return { gl, program };
};

const drawPlayer = (
  glContext: WebGLContext,
  player: Player,
) => {
  drawPoint(glContext, player.x, player.y, [1, 0, 0]);

  const lineSize = 25;
  drawLine(
    glContext,
    [player.x, player.y],
    [player.x + player.dirX * lineSize, player.y + player.dirY * lineSize],
    [1, 0, 0],
  );
};

const drawMap = (
  glContext: WebGLContext,
) => {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y * mapWidth + x] > 0) {
        const xo = x * TILE_SIZE;
        const yo = y * TILE_SIZE;
        drawQuad(
          glContext,
          [xo, yo],
          [xo + TILE_SIZE, yo],
          [xo + TILE_SIZE, yo + TILE_SIZE],
          [xo, yo + TILE_SIZE],
          [0, 0, 0],
        );
      }
    }
  }
};

export const miniMap = (
  player: Player,
  drawRect: (
    sectorIndex: number,
    height: number,
    color: Color,
  ) => void,
  numSectors: number,
) => {
  const { gl, program } = setup();
  const handleMove = (e: KeyboardEvent) => {
    if (e.code === Controls.Left && player.x > 0) {
      player.movePlayer('left');
    }
    if (e.code === Controls.Right && player.x < gl.canvas.width) {
      player.movePlayer('right');
    }
    if (e.code === Controls.Up && player.y < gl.canvas.height) {
      player.movePlayer('up');
    }
    if (e.code === Controls.Down && player.y > 0) {
      player.movePlayer('down');
    }
  };

  document.onkeydown = handleMove;

  gl.useProgram(program);

  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const positionBuffer = gl.createBuffer();
  const glContext = { gl, program, arrayBuffer: positionBuffer };
  drawPlayer(glContext, player);
  drawMap(glContext);
  castRays(glContext, player, drawRect, numSectors);
};
