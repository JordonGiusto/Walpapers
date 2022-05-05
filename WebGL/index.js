config = {
	zoom: 1,
	minzoom: 0.1,
	maxzoom: 5,
	mouseposX: 20,
	mouseposY: 20
};

canvas = document.getElementById('mainCanvas');
//get webgl 2 context
gl = canvas.getContext('webgl2');
//check if webgl 2 is supported
if (!gl) {
	alert('WebGL 2 is not available');
}
//the folowwing scales the canvas to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createShader (gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram (gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize (canvas) {
	// Lookup the size the browser is displaying the canvas in CSS pixels.
	const displayWidth = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;

	// Check if the canvas is not the same size.
	const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

	if (needResize) {
		// Make the canvas the same size
		canvas.width = displayWidth;
		canvas.height = displayHeight;
	}

	return needResize;
}
var shadownSteps = 20;
var vertexShaderSource = document.querySelector('#vert-shader').text;
var fragmentShaderSource = [
	document.querySelector('#frag-shader-1').text +
		'\t\tconst int SHADOWSTEPS = ' +
		shadownSteps +
		';' +
		document.querySelector('#frag-shader-2').text
].join('\n');

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

var program = createProgram(gl, vertexShader, fragmentShader);

var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
var zoomUniformLocation = gl.getUniformLocation(program, 'u_zoom');
var resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
var sphereUniformLocation = gl.getUniformLocation(program, 'u_sphere');
var shadowStepUniformLocation = gl.getUniformLocation(program, 'u_shadowSteps');
var ambientUniformLocation = gl.getUniformLocation(program, 'u_ambient');
var ditheruniformLocation = gl.getUniformLocation(program, 'u_dither');
var timeUniformLocation = gl.getUniformLocation(program, 'u_time');

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

var positions = [
	-1,
	-1,
	-1,
	1,
	1,
	-1,
	-1,
	1,
	1,
	1,
	1,
	-1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

function render () {
	resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);

	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	gl.uniform1f(ambientUniformLocation, 0.12);
	gl.uniform1f(ditheruniformLocation, 0.1);
	time = Date.now() / 2000;
	gl.uniform1f(timeUniformLocation, time);

	gl.uniform1f(zoomUniformLocation, config.zoom);

	rad = 200;
	sphereloc = [
		rad,
		rad,
		10
	];

	//multiply by spherloc elements by zoom
	x = sphereloc[0] * Math.sin(time);
	y = sphereloc[1] * Math.cos(time);

	sphereloc[0] = x;
	sphereloc[1] = y;

	gl.uniform3fv(sphereUniformLocation, sphereloc);

	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6;

	gl.drawArrays(primitiveType, offset, count);
	requestAnimationFrame(render);
}

function changeZoom (event) {
	config.zoom = config.zoom - event.deltaY * 0.02;
	config.zoom = Math.min(config.maxzoom, Math.max(config.minzoom, config.zoom));
}

function mousemove (event) {
	config.mouseposX = event.clientX;
	config.mouseposY = event.clientY;
}
window.addEventListener('mousemove', mousemove);
window.addEventListener('wheel', changeZoom);

render();

// const indexBuffer = gl.createBuffer();

// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

// const indicies = [
//     0, 1, 2,
//     2, 1, 3
// ];
// gl.bufferData(
//     gl.ELEMENT_ARRAY_BUFFER,
//     new Uint16Array(indicies),
//     gl.STATIC_DRAW
// );
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
// var indexType = gl.UNSIGNED_SHORT;
// gl.drawElements(primitiveType, count, indexType, offset);
