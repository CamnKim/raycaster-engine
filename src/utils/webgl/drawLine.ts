import { WebGLContext } from '../../types/types';

const drawLine = (
  glContext: WebGLContext,
  v1: [number, number],
  v2: [number, number],
  color: [number, number, number],
) => {
  const { gl, program, arrayBuffer } = glContext;

  gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([...v1, ...color, ...v2, ...color]),
    gl.STATIC_DRAW,
  );

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

  gl.drawArrays(gl.LINES, 0, 2);
};

export default drawLine;
