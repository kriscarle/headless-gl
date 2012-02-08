var WebGL=require('../../index'),
    Image = WebGL.Image,
    document = WebGL.document(),
    nodejs = true;
document.setTitle("Camera");
window = document;
requestAnimationFrame = document.requestAnimationFrame;

//Read and eval library
fs=require('fs');
eval(fs.readFileSync(__dirname+ '/lightgl.js','utf8'));

var time = 0;
var gl = GL.create();
var mesh = GL.Mesh.sphere({ normals: true });
var badShader = new GL.Shader('\
  varying vec3 normal;\
  void main() {\
    normal = (gl_ModelViewMatrix * vec4(gl_Normal, 0.0)).xyz;\
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
  }\
', '\
  varying vec3 normal;\
  void main() {\
    gl_FragColor = vec4(normalize(normal) * 0.5 + 0.5, 1.0);\
  }\
');
var goodShader = new GL.Shader('\
  varying vec3 normal;\
  void main() {\
    normal = gl_NormalMatrix * gl_Normal;\
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
  }\
', '\
  varying vec3 normal;\
  void main() {\
    gl_FragColor = vec4(normalize(normal) * 0.5 + 0.5, 1.0);\
  }\
');

gl.onupdate = function(seconds) {
  time += seconds;
};

gl.ondraw = function() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.loadIdentity();
  gl.translate(0, 0, -10);
  gl.rotate(10, 1, 0, 0);

  var scale = 1.2 + 0.7 * Math.cos(time);

  gl.pushMatrix();
  gl.translate(-2, 0, 0);
  gl.scale(1 / scale, scale, 1);
  badShader.draw(mesh);
  gl.popMatrix();

  gl.pushMatrix();
  gl.translate(2, 0, 0);
  gl.scale(1 / scale, scale, 1);
  goodShader.draw(mesh);
  gl.popMatrix();
};

gl.fullscreen();
gl.animate();
gl.enable(gl.DEPTH_TEST);