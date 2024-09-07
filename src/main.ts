import './style.css';
import { compileShader, createProgram, webGLInit } from './utils/webgl/utils';
import vertexShaderSource from './shaders/vertexShader.glsl?raw';
import fragmentShaderSource from './shaders/fragmentShader.glsl?raw';
import { Color, WebGLContext } from './types/types';
import { miniMap } from './minimap';
import Player from './types/Player';

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
  glContext: WebGLContext,
  sectorIndex: number,
  height: number,
  color: Color,
) => {
  const { gl, arrayBuffer, program } = glContext;
  const yOffset = (screenHeight - (height)) / 2;
  const x1 = sectorIndex * screenSectorSize;
  const y1 = height + yOffset;
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

// console.log({ numSectors });

const main = () => {
  // Setup
  const { gl, program } = setup();
  gl.useProgram(program);

  const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const positionBuffer = gl.createBuffer();

  const player = new Player(200, 200);

  const glContext: WebGLContext = { gl, program, arrayBuffer: positionBuffer };
  const numSectors = screenWidth / screenSectorSize;

  // Render Loop
  const loop = () => {
    miniMap(player, (
      sectorIndex: number,
      height: number,
      color: Color,
    ) => drawRect(glContext, sectorIndex, height, color), numSectors);
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);

  // miniMap(player, (
  //   sectorIndex: number,
  //   height: number,
  //   color: Color,
  // ) => drawRect(glContext, sectorIndex, height, color));
};

main();
