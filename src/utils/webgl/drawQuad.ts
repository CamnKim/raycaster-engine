import { WebGLContext } from '../../types/types';

const drawQuad = (
  glContext: WebGLContext,
  v1: [number, number],
  v2: [number, number],
  v3: [number, number],
  v4: [number, number],
  color: [number, number, number],
) => {
  const {
    gl, program, arrayBuffer,
  } = glContext;
  const vertices = new Float32Array([
    ...v1, ...color,
    ...v2, ...color,
    ...v3, ...color,
    ...v4, ...color,
  ]);

  const indices = [
    3, 0, 1, 3, 1, 2,
  ];

  gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const elementArrayBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementArrayBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

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

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};

export default drawQuad;
