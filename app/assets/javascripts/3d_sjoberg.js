
//   shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  //'attribute vec4 a_color;\n' +
  'varying vec4 v_color;\n' +

  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_MvpMatrix;\n' +

  'uniform vec4 u_Color;\n' +

  'uniform vec3 u_LightDirection;\n' +
  'uniform vec3 u_LightColor;\n' +
  'uniform vec3 u_AmbientLight;\n' +

  'uniform float u_lighty;\n' +
  
//uniform vec3 u_ambientLight;  

  
  'void main() {\n' +
  ' gl_Position = u_MvpMatrix  * a_Position;\n' + //translate

	//NOTE: DO PROJECTION * VIEW - projection THEN view
	//THEN vp * model
	
  //'  vec4 color = vec4(0.5, 0.5, 0.5, 1.0);\n' +  // Ship color
  
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  // Dot product of the light direction and the orientation of a surface (the normal)
  '   float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' +  

 // '  float nDotL = max(dot(u_LightDirection, normal), 0.0);}\n' +

  // Calculate the color due to diffuse reflection
  '  vec3 diffuse =  u_LightColor * nDotL * u_Color.rgb ;\n' +
  '  vec3 ambient = u_AmbientLight * u_Color.rgb;\n' +
  '  v_color = vec4(diffuse + ambient, u_Color.a);\n' +
  //'  v_color = vec4(diffuse , color.a);\n' +

  //'v_color = a_color;\n'+ //COMMENT OUT LATER
  '}\n';
  
//v_color = vec4(diffuse,a_color.a)



//vec3 ambient = u_AmbientLight * a_color.rgb
//v_color = vec4 diffuse*ambient?
  

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' + 
  'varying vec4 v_color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_color;\n' +
  '}\n';

var u_MvpMatrix;
var n;

//Canvas and context
var canvas;
var gl;

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4() , g_normalMatrix = new Matrix4();

// Calculate the view projection matrix
var g_viewProjMatrix = new Matrix4();





function main() {
  canvas = document.getElementById('webgl');
  gl = getWebGLContext(canvas,true);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.0, 0.0,0.0,1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  g_viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
  g_viewProjMatrix.lookAt(30.0, 30.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }



  g_modelMatrix.setScale(1.0,1.0,10.0)



  lighting()
  n = initVertexBuffers(gl)
  render()
}

var lightx = 0;
var lighty = 0;
var lightz = 5;
var light_angle = 0;
var r = 20;
var day = true;

var x_pos = 1.0;
var z_pos = 1.0;
var angle = 0.0;

var body_height = 10;

function render(){

	angle +=1;
	//x_pos +=.5;
	x_pos %= 100

  light_angle += .01;
  lght_angle = light_angle % 360.0;

  lightx = r * Math.cos(light_angle);
  lighty = r * Math.sin(light_angle);

  var u_lighty = gl.getUniformLocation(gl.program, 'u_lighty');
  gl.uniform1f(u_lighty,lighty);
  if (lighty > 0.0){
    lighting(true);
  }else{
    lighty = -lighty;
    lightx = -lightx;

    lighting(false);
  }

  drawAll()
  requestAnimationFrame(render);
}

function drawAll(){
    // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawGround();
  drawBody();
  drawWing(0);
  drawWing(1);

}

function drawGround(){

  //color
  var u_Color = gl.getUniformLocation(gl.program , 'u_Color');
  gl.uniform4fv(u_Color , new Vector4([0.627451, 0.321569, 0.176471,1.0]).elements);

  //model
  g_modelMatrix.setScale(100.0,0.1,100.0);

  //view
  g_mvpMatrix.set(g_viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);

  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function drawBody(){

  var u_Color = gl.getUniformLocation(gl.program , 'u_Color');
  gl.uniform4fv(u_Color , new Vector4([0.31, 0.31, 0.333333,1.0]).elements);
  
  g_modelMatrix.setRotate(angle,0.0,1.0,0.0)
  g_modelMatrix.translate(x_pos,body_height,z_pos);
  g_modelMatrix.scale(10.0,7.0,10.0);

  g_mvpMatrix.set(g_viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);

  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

  //send mvp
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function drawWing(side){
  var u_Color = gl.getUniformLocation(gl.program , 'u_Color');
  gl.uniform4fv(u_Color , new Vector4([0.31, 0.31, 0.333333,1.0]).elements);
  
  g_modelMatrix.setRotate(angle,0.0,1.0,0.0)
  g_modelMatrix.translate(x_pos,body_height-5,z_pos + -5.0);
  g_modelMatrix.scale(16.0,16.0,.05);
  

  g_mvpMatrix.set(g_viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);

  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

  //send mvp
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
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



function initVertexBuffers(gl) {
  // Coordinates（Cube which length of one side is 1 with the origin on the center of the bottom)
  var vertices = new Float32Array([
    0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
    0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
    0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
   -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
   -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
    0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
  ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices,  3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals,  3, gl.FLOAT)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}


function lighting(day){
  var lightDirection = new Vector3([lightx, lighty, lightz]);
  lightDirection.normalize();

  var u_LightDirection = gl.getUniformLocation(gl.program,'u_LightDirection')
  gl.uniform3fv(u_LightDirection,lightDirection.elements);

  if (day){
    var lightColor = new Vector3([.933333 ,0.866667 ,0.509804]);
  }else{
    var lightColor = new Vector3([ 0.156863, 0.156863, 0.156863]);
  }

  var u_LightColor = gl.getUniformLocation(gl.program,'u_LightColor')
  gl.uniform3fv(u_LightColor,lightColor.elements);
  
  var ambientLight = new Vector3([0.1,0.1,0.1]);
  ambientLight.normalize();
  var u_AmbientLight = gl.getUniformLocation(gl.program,'u_AmbientLight')
  gl.uniform3fv(u_AmbientLight,ambientLight.elements);
  
}

