
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_color;\n' +
  'varying vec4 v_color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform vec4 u_translation;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'void main() {\n' +
  ' gl_Position = a_Position + u_translation ;\n' +
  ' gl_Position = gl_Position * u_ViewMatrix;\n' +
  ' gl_Position = gl_Position * u_MvpMatrix;\n' +

  'v_color = a_color;\n'+
  '}\n';


// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' + 
  'varying vec4 v_color;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_color;\n' +
  '}\n';

// The rotation angle
var ANGLE = 0.0;
var POINTS =[];
var COLORS = [];
var mvpMatrix = new Matrix4();
var u_MvpMatrix;

var eyeX = 0;
var eyeY = 0;
var atX = 0;
var atY = 0;
var atZ = -1;
var upX = 0;
var upY = 1;

var gl;

function run_webgl() {
  var canvas = document.getElementById('c1');
  gl = getWebGLContext(canvas,true);
  gl.enable(gl.DEPTH_TEST);
  
  gl.clearColor(0.0, 0.0,0.0,1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  initCube();
  initPyramid();
  render();

}

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  ANGLE += 0.3;
  init_view_matrix();
  rotate_and_translate(0.0,0.0,0.0,0,1,0);
  vertices_and_color_cube();
  gl.drawArrays(gl.TRIANGLES,0,36);

  initPyramid();
  rotate_and_translate(1.0,0.0,0.0,1,1,1);
  gl.drawArrays(gl.TRIANGLES,0,18);
  requestAnimationFrame(render);
}

function initCube(){
  quad(1,0,3,2);
  quad(2,3,7,6);
  quad(3,0,4,7);
  quad(6,5,1,2);
  quad(4,5,6,7);
  quad(5,4,0,1);
}

function initPyramid(){
	tip = [0.0,0.3,0.0]
	front_left = [-0.3, -0.3, 0.3]
	front_right = [0.3 , -0.3 , 0.3]
	back_left = [-0.3, -0.3, -0.3]
	back_right = [0.3 , -0.3 , -0.3]
	color1 = [1.0,1.0,1.0];
	color2 = [1.0,0.0,0.0];
	color3 = [0.0,1.0,0.0];
  color4 = [0.0,0.0,1.0];
  color5 = [1.0,1.0,0.0];


	colors = color1.concat(color1,color1,color2,color2,color2,color3,color3,color3,color4,color4,color4,color5,color5,color5,color5,color5,color5,color5);
	vertices = tip.concat(front_left , front_right,tip,back_left,back_right,tip,back_left,front_left,tip,front_right,back_right,front_left,front_right,back_right,front_left,back_left,back_right);
	
	//vertices
	var pyramid_vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,pyramid_vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(vertices),gl.STATIC_DRAW);

	var a_position = gl.getAttribLocation(gl.program , 'a_Position');
	gl.vertexAttribPointer(a_position, 3, gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(a_position);

	//color
  var pyramid_color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,pyramid_color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER,flatten(colors),gl.STATIC_DRAW);

  var a_color = gl.getAttribLocation (gl.program , 'a_color');
  gl.vertexAttribPointer(a_color,3,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(a_color);
}


function init_view_matrix(){

  var u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ViewMatrix');
  var viewMatrix = new Matrix4();
  //console.log(eyeX,eyeY,atX,atY,upXupY);
  viewMatrix.setLookAt(eyeX,eyeY,0.0,atX,atY,-1.0,upX,upY,0.0);
  gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);
}

function rotate_and_translate(tX,tY,tZ,xRot,yRot,zRot){
  //Translations
  var u_translation = gl.getUniformLocation(gl.program,'u_translation');
  gl.uniform4f(u_translation,tX,tY,0,0.0);

  //Rotation
  mvpMatrix.setRotate(ANGLE, xRot,yRot,zRot);
  u_MvpMatrix = gl.getUniformLocation(gl.program,'u_MvpMatrix');
  gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.elements);
}

function vertices_and_color_cube(){
//vertices
  var square_vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,square_vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER,flatten(POINTS),gl.STATIC_DRAW);

  var a_position = gl.getAttribLocation(gl.program , 'a_Position');
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(a_position);

//color

/*
  COLORS = [];
  for (var i = 0; i <= 350; i++){
    COLORS.push(Math.random());
  }
*/
  var square_color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,square_color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER,flatten(COLORS),gl.STATIC_DRAW);

  var a_color = gl.getAttribLocation (gl.program , 'a_color');
  gl.vertexAttribPointer(a_color,3,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(a_color);

}


function move_view(e){
  if (e.keyCode == 87){
    eyeY += .1;
    //atY += .1;
    //upY += .1;
  }
  else if (e.keyCode == 83){
    eyeY -= .1;
    //atY -= .1;
    //upY -= .1; 
  }
  else if (e.keyCode == 65){
    eyeX -= .1;
   // atX -= .1;
    //upX -= .1;
  }
  else if (e.keyCode == 68){
    eyeX += .1;
    //atX += .1;
    //upX += .1;
  }
}


function quad(a,b,c,d){
  var vertices = [
  [-0.5,-0.5,0.5],[-0.5,0.5,0.5],
  [0.5,0.5,0.5],[0.5,-0.5,0.5],
  [-0.5,-0.5,-0.5],[-0.5,0.5,-0.5],
  [0.5,0.5,-0.5],[0.5,-0.5,-0.5]
  ]

  var vertex_colors = [
  [Math.random(),Math.random(),Math.random(),Math.random()],
  [Math.random(),Math.random(),Math.random(),Math.random()],
  [Math.random(),Math.random(),Math.random(),Math.random()],
  [Math.random(),Math.random(),Math.random(),Math.random()],
  [Math.random(),Math.random(),Math.random(),Math.random()],
  [Math.random(),Math.random(),Math.random(),Math.random()],
  [Math.random(),Math.random(),Math.random(),Math.random()],
  [Math.random(),Math.random(),Math.random(),Math.random()]
  ]

  var indices = [a,b,c,a,c,d];

  for (var i = 0; i< indices.length; ++i){
    POINTS.push(vertices[indices[i]]);
    COLORS.push(vertex_colors[indices[i]]);
  }
  for (var i = 0; i<36;i++){
    COLORS.push(Math.random());
  }
}


function flatten (v){
  var n = v.length;
  var elemsAreArrays = false;

  if (Array.isArray(v[0])){
    elemsAreArrays = true;
    n *= v[0].length;
  } 
  var floats = new Float32Array(n);

  if (elemsAreArrays){
    var idx = 0;
    for (var i = 0; i < v.length; ++i){
      for (var j = 0; j < v[i].length; ++j){
        floats[idx++] = v[i][j];
      }
    }
  }
  else{
    for (var i = 0; i < v.length; ++i){
      floats[i] = v[i];
    }
  }
  return floats;
}