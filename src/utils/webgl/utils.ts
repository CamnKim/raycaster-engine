/**
 * Function to initialize WebGL context with canvas, proper viewport dimensions, and culling
 * @returns configured webgl context
 */
export const webGLInit = (
  canvasId: string,
  clearColor: [GLclampf, GLclampf, GLclampf, GLclampf] = [1, 1, 1, 1],
): WebGLRenderingContext => {
  const canvas = document.querySelector<HTMLCanvasElement>(canvasId);
  if (!canvas) {
    throw new Error('Could not find canvas element');
  }

  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('Error: Your browser does not support WebGL');
  }

  // Resize viewport
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  if (displayWidth !== canvas.width || displayHeight !== canvas.height) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  // Clear buffers
  gl.clearColor(...clearColor);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.DEPTH_BUFFER_BIT);

  // WebGL config
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK); // Enable back-face culling

  return gl;
};

/**
 *
 * @param gl WebGL rendering context
 * @param source Stringified glsl shader
 * @param type Shader type
 * @returns Compiled shader
 */
export const compileShader = (
  gl: WebGLRenderingContext,
  source: string,
  type: GLenum,
): WebGLShader => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Could not create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
  }

  return shader;
};

export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram => {
  const program = gl.createProgram();
  if (!program) {
    throw new Error('Could not create program');
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link program
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Error linking WebGL program: ${gl.getProgramInfoLog(program)}`);
  }

  return program;
};
