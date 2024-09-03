export type Color = {
  r: number;
  g: number;
  b: number;
};

export type WebGLContext = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  arrayBuffer: WebGLBuffer | null;
};
