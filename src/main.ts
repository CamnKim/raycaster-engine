import './style.css';
import { compileShader, createProgram, webGLInit } from './utils/webgl/utils';
import vertexShaderSource from './shaders/vertexShader.glsl?raw';
import fragmentShaderSource from './shaders/fragmentShader.glsl?raw';
import { Color, WebGLContext } from './types/types';
import { miniMap } from './minimap';
import Player from './types/Player';
import castRays from './utils/webgl/castRay';

const canvas = document.querySelector('#view');

if (!canvas) {
  throw new Error('No canvas element');
}

const screenWidth = canvas.clientWidth;
const screenHeight = canvas.clientHeight;

const screenSectorSize = 10;

const setup = () => {
  const gl = webGLInit('#view');
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

  const program = createProgram(gl, vertexShader, fragmentShader);

  return { gl, program };
};

const drawRect = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  arrayBuffer: WebGLBuffer | null,
  sectorIndex: number,
  height: number,
  color: Color,
) => {
  const yOffset = (screenHeight - (height * screenHeight)) / 2;
  const x1 = sectorIndex * screenSectorSize;
  const y1 = height * screenHeight + yOffset;
  const x2 = (sectorIndex + 1) * screenSectorSize;
  const y2 = yOffset;

  const rectVertexes = new Float32Array([
    x2, y1, color.r, color.g, color.b,
    x1, y1, color.r, color.g, color.b,
    x1, y2, color.r, color.g, color.b,
    x2, y1, color.r, color.g, color.b,
    x1, y2, color.r, color.g, color.b,
    x2, y2, color.r, color.g, color.b,
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, rectVertexes, gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
  const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  const coordSize = 2;
  const colorSize = 3;
  const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
  const coordOffset = 0;
  const colorOffset = coordSize * Float32Array.BYTES_PER_ELEMENT;

  gl.vertexAttribPointer(
    positionAttributeLocation,
    coordSize,
    gl.FLOAT,
    false,
    stride,
    coordOffset,
  );
  gl.vertexAttribPointer(colorAttribLocation, colorSize, gl.FLOAT, false, stride, colorOffset);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

const numSectors = screenWidth / screenSectorSize;

const main = () => {
  // Setup
  const { gl, program } = setup();
  gl.useProgram(program);

  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const positionBuffer = gl.createBuffer();

  const player = new Player(200, 200);

  const glContext: WebGLContext = { gl, program, arrayBuffer: positionBuffer };

  const movePlayer = (dir: 'left' | 'right' | 'up' | 'down') => {
    const turnSpeed = 0.2;
    if (dir === 'left') {
      player.pa -= turnSpeed;
      if (player.pa < 0) {
        player.pa = 2 * Math.PI;
      }

      player.pdx = Math.sin(player.pa) * player.getSpeed();
      player.pdy = Math.cos(player.pa) * player.getSpeed();
    }
    if (dir === 'right') {
      player.pa += turnSpeed;
      if (player.pa > 2 * Math.PI) {
        player.pa = 0;
      }

      player.pdx = Math.sin(player.pa) * player.getSpeed();
      player.pdy = Math.cos(player.pa) * player.getSpeed();
    }
    if (dir === 'up') {
      player.px += player.pdx;
      player.py += player.pdy;
    }
    if (dir === 'down') {
      player.px -= player.pdx;
      player.py -= player.pdy;
    }
  };

  // Render Loop
  const hinc = screenHeight / numSectors;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numSectors; ++i) {
    drawRect(gl, program, positionBuffer, i, (i * hinc) / screenHeight, { r: 1, g: 0, b: 0 });
  }

  // init delta pos

  const loop = () => {
    miniMap(player, movePlayer);
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
};

main();
