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
//
// function drawFractalToCanvas(pixels){
// 	var x;
// 	var y;
//
// 	for(x = 0; x < width; x++){
// 		for(y = 0; y < height; y++){
// 			let index = (y * width) + x;
// 			let color = pixels[index];
// 			setPixelRGB(x, y, color[0], color[1], color[2]);
// 		}
// 	}
// }
//
// function setPixelHex(x, y, hex){
// 	fractalCtx.fillStyle = hex;
// 	fractalCtx.fillRect( x, y, 1, 1 );
// }

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