precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

uniform vec2 resolution;

varying vec3 fragColor;

void main() {
  fragColor = vertColor;

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = vertPosition / resolution;
  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;
  // convert from 0->2 to -1 -> +1
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace , 0.0, 1.0);
}