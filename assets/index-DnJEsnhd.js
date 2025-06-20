var X=Object.defineProperty;var N=(o,r,n)=>r in o?X(o,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):o[r]=n;var S=(o,r,n)=>N(o,typeof r!="symbol"?r+"":r,n);(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(e){if(e.ep)return;e.ep=!0;const i=n(e);fetch(e.href,i)}})();const x=(o,r=[1,1,1,1])=>{const n=document.querySelector(o);if(!n)throw new Error("Could not find canvas element");const t=n.getContext("webgl");if(!t)throw new Error("Error: Your browser does not support WebGL");const e=n.clientWidth,i=n.clientHeight;return(e!==n.width||i!==n.height)&&(n.width=e,n.height=i),t.viewport(0,0,n.width,n.height),t.clearColor(...r),t.clear(t.COLOR_BUFFER_BIT),t.clear(t.DEPTH_BUFFER_BIT),t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.frontFace(t.CCW),t.cullFace(t.BACK),t},b=(o,r,n)=>{const t=o.createShader(n);if(!t)throw new Error("Could not create shader");if(o.shaderSource(t,r),o.compileShader(t),!o.getShaderParameter(t,o.COMPILE_STATUS))throw new Error(`Error compiling shader: ${o.getShaderInfoLog(t)}`);return t},Y=(o,r,n)=>{const t=o.createProgram();if(!t)throw new Error("Could not create program");if(o.attachShader(t,r),o.attachShader(t,n),o.linkProgram(t),!o.getProgramParameter(t,o.LINK_STATUS))throw new Error(`Error linking WebGL program: ${o.getProgramInfoLog(t)}`);return t},I=`precision mediump float;

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
}`,B=`precision mediump float;

varying vec3 fragColor;

void main() {
  gl_FragColor = vec4(fragColor, 1.0);
}`,U=`precision mediump float;

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
  gl_PointSize = 10.0;
}`,T=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,2,0,0,0,2,0,0,0,1,1,0,0,0,0,0,0,2,0,0,0,2,0,0,0,1,1,0,0,0,0,0,0,2,2,2,2,2,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,2,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,3,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],L=16,z=16,H=(o,r,n,t,e,i)=>{const{gl:s,program:c,arrayBuffer:f}=o,a=new Float32Array([...r,...i,...n,...i,...t,...i,...e,...i]),d=[3,0,1,3,1,2];s.bindBuffer(s.ARRAY_BUFFER,f),s.bufferData(s.ARRAY_BUFFER,a,s.STATIC_DRAW);const l=s.createBuffer();s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,l),s.bufferData(s.ELEMENT_ARRAY_BUFFER,new Uint16Array(d),s.STATIC_DRAW);const h=s.getAttribLocation(c,"vertPosition"),u=s.getAttribLocation(c,"vertColor"),A=2,m=3,g=5*Float32Array.BYTES_PER_ELEMENT,v=0,y=A*Float32Array.BYTES_PER_ELEMENT;s.vertexAttribPointer(h,A,s.FLOAT,!1,g,v),s.vertexAttribPointer(u,m,s.FLOAT,!1,g,y),s.drawElements(s.TRIANGLES,d.length,s.UNSIGNED_SHORT,0)},M=(o,r,n,t)=>{const{gl:e,program:i,arrayBuffer:s}=o;e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,new Float32Array([...r,...t,...n,...t]),e.STATIC_DRAW);const c=e.getAttribLocation(i,"vertPosition"),f=e.getAttribLocation(i,"vertColor"),a=2,d=3,l=5*Float32Array.BYTES_PER_ELEMENT,h=0,u=a*Float32Array.BYTES_PER_ELEMENT;e.vertexAttribPointer(c,a,e.FLOAT,!1,l,h),e.vertexAttribPointer(f,d,e.FLOAT,!1,l,u),e.drawArrays(e.LINES,0,2)},W=(o,r,n,t)=>{const{gl:e,program:i,arrayBuffer:s}=o,c=new Float32Array([r,n,...t]);e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,c,e.STATIC_DRAW);const f=e.getAttribLocation(i,"vertPosition"),a=e.getAttribLocation(i,"vertColor"),d=2,l=3,h=5*Float32Array.BYTES_PER_ELEMENT,u=0,A=d*Float32Array.BYTES_PER_ELEMENT;e.vertexAttribPointer(f,d,e.FLOAT,!1,h,u),e.vertexAttribPointer(a,l,e.FLOAT,!1,h,A),e.enableVertexAttribArray(f),e.enableVertexAttribArray(a),e.drawArrays(e.POINTS,0,1)},E=25,_=(o,r,n)=>{const[t,e]=o;let i,s;if(r>0){const c=t;i=t*Math.cos(-n)-e*Math.sin(-n),s=c*Math.sin(-n)+e*Math.cos(-n)}else{const c=t;i=t*Math.cos(n)-e*Math.sin(n),s=c*Math.sin(n)+e*Math.cos(n)}return{x:i,y:s}},p=o=>o-o%E,C=(o,r)=>{const n=Math.floor(o/E);return Math.floor(r/E)*L+n},O=document.querySelector("#view");if(!O)throw new Error("No canvas element");const R=O.clientHeight,G=(o,r)=>{const n=o[0],t=o[1];let e=p(r.x),i=p(r.y);const s=n!==0?Math.abs(1/n):100,c=t!==0?Math.abs(1/t):100;let f,a,d,l,h=0,u=0,A=0;for(n<0?(f=-1,d=(r.x-e)*s):(f=1,d=(e+1-r.x)*s),t<0?(a=-1,l=(r.y-i)*c):(a=1,l=(i+1-r.y)*c);u===0;){d<l?(d+=s,e+=f,A=0):(l+=c,i+=a,A=1);const v=C(e,i);T[v]>0&&(u=T[v])}let m=r.x,g=r.y;return A===0?(h=d-s,m=e,g=i+(1-a)/2):(h=l-c,g=i,m=e+(1-f)/2),{dist:h,side:A,x:m,y:g,hit:u}},w={red:{0:{r:1,g:0,b:0},1:{r:.7,g:0,b:0}},green:{0:{r:0,g:1,b:0},1:{r:0,g:.7,b:0}},blue:{0:{r:0,g:0,b:1},1:{r:0,g:0,b:.7}}},K=(o,r)=>o===2?w.red[r]:o===1?w.blue[r]:w.green[r],V=(o,r,n,t)=>{const e=.0174533;let i=_([r.dirX,r.dirY],-1,e*48);for(let s=0;s<t;s++){const c=G([i.x,i.y],r);M(o,[r.x,r.y],[c.x,c.y],[0,1,0]);const a=R/c.dist*75;n(s,a>R?R:a,K(c.hit,c.side)),i=_([i.x,i.y],1,e)}},q=()=>{const o=x("#minimap",[.25,.25,.25,.25]),r=b(o,U,o.VERTEX_SHADER),n=b(o,B,o.FRAGMENT_SHADER),t=Y(o,r,n);return{gl:o,program:t}},$=(o,r)=>{W(o,r.x,r.y,[1,0,0]);const n=25;M(o,[r.x,r.y],[r.x+r.dirX*n,r.y+r.dirY*n],[1,0,0])},Q=o=>{for(let r=0;r<z;r++)for(let n=0;n<L;n++)if(T[r*L+n]>0){const t=n*E,e=r*E;H(o,[t,e],[t+E,e],[t+E,e+E],[t,e+E],[0,0,0])}},Z=(o,r,n)=>{const{gl:t,program:e}=q(),i=a=>{a.code==="KeyA"&&o.x>0&&o.movePlayer("left"),a.code==="KeyD"&&o.x<t.canvas.width&&o.movePlayer("right"),a.code==="KeyW"&&o.y<t.canvas.height&&o.movePlayer("up"),a.code==="KeyS"&&o.y>0&&o.movePlayer("down")};document.onkeydown=i,t.useProgram(e);const s=t.getUniformLocation(e,"resolution");t.uniform2f(s,t.canvas.width,t.canvas.height);const c=t.createBuffer(),f={gl:t,program:e,arrayBuffer:c};$(f,o),Q(f),V(f,o,r,n)};class j{constructor(r,n){S(this,"x");S(this,"y");S(this,"dirX");S(this,"dirY");S(this,"speed",20);S(this,"rotSpeed",.1);this.x=r,this.y=n,this.dirX=1,this.dirY=0}getSpeed(){return this.speed}rotate(r){if(r>0){const n=this.dirX;this.dirX=this.dirX*Math.cos(-this.rotSpeed)-this.dirY*Math.sin(-this.rotSpeed),this.dirY=n*Math.sin(-this.rotSpeed)+this.dirY*Math.cos(-this.rotSpeed)}else{const n=this.dirX;this.dirX=this.dirX*Math.cos(this.rotSpeed)-this.dirY*Math.sin(this.rotSpeed),this.dirY=n*Math.sin(this.rotSpeed)+this.dirY*Math.cos(this.rotSpeed)}}movePlayer(r){if(r==="left"&&this.rotate(-1),r==="right"&&this.rotate(1),r==="up"){const n=this.x+this.dirX,t=this.y+this.dirY,e=p(n),i=p(t);T[C(e,i)]===0&&(this.x=n,this.y=t)}r==="down"&&(this.x-=this.dirX,this.y-=this.dirY)}}const P=document.querySelector("#view");if(!P)throw new Error("No canvas element");const J=P.clientWidth,k=P.clientHeight,F=10,tt=()=>{const o=x("#view"),r=b(o,I,o.VERTEX_SHADER),n=b(o,B,o.FRAGMENT_SHADER),t=Y(o,r,n);return{gl:o,program:t}},et=(o,r,n,t)=>{const{gl:e,arrayBuffer:i,program:s}=o,c=(k-n)/2,f=r*F,a=n+c,d=(r+1)*F,l=c,h=new Float32Array([d,a,t.r,t.g,t.b,f,a,t.r,t.g,t.b,f,l,t.r,t.g,t.b,d,a,t.r,t.g,t.b,f,l,t.r,t.g,t.b,d,l,t.r,t.g,t.b]);e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,h,e.STATIC_DRAW);const u=e.getAttribLocation(s,"vertPosition"),A=e.getAttribLocation(s,"vertColor"),m=2,g=3,v=5*Float32Array.BYTES_PER_ELEMENT,y=0,D=m*Float32Array.BYTES_PER_ELEMENT;e.vertexAttribPointer(u,m,e.FLOAT,!1,v,y),e.vertexAttribPointer(A,g,e.FLOAT,!1,v,D),e.enableVertexAttribArray(u),e.enableVertexAttribArray(A),e.drawArrays(e.TRIANGLES,0,6)},ot=()=>{const{gl:o,program:r}=tt();o.useProgram(r);const n=o.getUniformLocation(r,"resolution");o.uniform2f(n,o.canvas.width,o.canvas.height);const t=o.createBuffer(),e=new j(200,200),i={gl:o,program:r,arrayBuffer:t},s=J/F,c=()=>{Z(e,(f,a,d)=>et(i,f,a,d),s),requestAnimationFrame(c)};requestAnimationFrame(c)};ot();
