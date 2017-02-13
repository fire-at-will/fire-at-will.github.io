var fractalCanvas;
var fractalCtx;

var height;
var width;

function initCanvas(width, height){
	fractalCanvas = document.getElementById('fractalCanvas');
	fractalCtx = fractalCanvas.getContext('2d');

	fractalCanvas.width  = width;
	fractalCanvas.height = height;

	canvasOffset = $('#fractalCanvas').offset();
	offsetX = canvasOffset.left;
	offsetY = canvasOffset.top;

	// Set canvas onMouseDown, onMouseUp, and onMouseMove (Used for zooming)
	$('#fractalCanvas').on('mousedown', function(e){
		onMouseDown(e);
	});

}

function setPixelRGB(x, y, r, g, b){
	fractalCtx.fillStyle = 'rgba('+r+','+g+','+b+','+1+')';
	fractalCtx.fillRect( x, y, 1, 1 );
}

function showPNG(){
	window.open(fractalCanvas.toDataURL('image/png'), '_blank');
}

function getPixelRow(){
	return fractalCtx.createImageData(width, 1);
}

function drawPixelRow(pixels, row){
	fractalCtx.putImageData(pixels, 0, row);
}