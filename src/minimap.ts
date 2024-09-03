import { compileShader, createProgram, webGLInit } from './utils/webgl/utils';
import vertexShaderSource from './shaders/pointVert.glsl?raw';
import fragmentShaderSource from './shaders/fragmentShader.glsl?raw';
import map, { mapHeight, mapWidth } from './constants/map';
import { WebGLContext } from './types/types';
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
  drawPoint(glContext, player.px, player.py, [1, 0, 0]);

  const lineSize = 3;
  drawLine(
    glContext,
    [player.px, player.py],
    [player.px + player.pdx * lineSize, player.py + player.pdy * lineSize],
    [1, 0, 0],
  );
};

const drawMap = (
  glContext: WebGLContext,
) => {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y * mapWidth + x] === 1) {
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

export const miniMap = (player: Player, handleMovement: (dir: 'left' | 'right' | 'up' | 'down') => void) => {
  const { gl, program } = setup();

  const handleMove = (e: KeyboardEvent) => {
    if (e.code === Controls.Left && player.px > 0) {
      handleMovement('left');
    }
    if (e.code === Controls.Right && player.px < gl.canvas.width) {
      handleMovement('right');
    }
    if (e.code === Controls.Up && player.py < gl.canvas.height) {
      handleMovement('up');
    }
    if (e.code === Controls.Down && player.py > 0) {
      handleMovement('down');
    }
  };

  document.onkeydown = handleMove;

  gl.useProgram(program);

  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const positionBuffer = gl.createBuffer();
  const glContext = { gl, program, arrayBuffer: positionBuffer };
  castRays(glContext, player);
  drawPlayer(glContext, player);
  drawMap(glContext);
};
