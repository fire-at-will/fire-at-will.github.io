var startX;
var startY;
var canvasOffset;
var offsetX;
var offsetY;

function redraw(){
	generateMandelbrot();
}

function onMouseDown(e){
	// Get mouse coordinates
	var mouseX = parseInt(e.clientX - offsetX);
	var mouseY = parseInt(e.clientY - offsetY);


	if($(document).scrollTop() != 0){
        $('html, body').animate({
            scrollTop: ($('#fractalCanvas').offset().top)
        },750);

        return;
	}


	if(autoIncrementIterations){
		maxIterations += 25;
		$('#iteration-input').val(maxIterations);
	}

	/*
	* We're dealing with two coordinate planes here: 
	*	1) The physical coordinate plane on the screen that comprises of pixels
	*	2) The logical coordinate plane of real numbers on the X axis and complex
	*		numbers on the Y axis.
	*
	* We need to convert from plane 1 to 2 in order to get the proper values of min/max R
	* and I in order to properly zoom.
	*/

	// Calculate new center of the view (in logical coordinate plane)
	// based on where the user clicks.
	var centerX = mapScreenPixelsToCoordinatePlane(mouseX, width, minR, maxR);
	var centerY = mapScreenPixelsToCoordinatePlane(mouseY, height, minI, maxI);

	if(e.shiftKey){
		// Zoom out
		// Zoom out on the point while maintaining aspect ratio
		var rRange = maxR - minR;
		var iRange = maxI - minI;

		var zoom = 1 + zoomRate;

		minR = centerX - ((rRange / 2) * zoom);
		maxR = centerX + ((rRange / 2) * zoom);

		minI = centerY - ((iRange / 2) * zoom);
		maxI = centerY + ((iRange / 2) * zoom);

	} else {
		// Zoom in
		// Zoom in on the point while maintaining aspect ratio
		var rRange = maxR - minR;
		var iRange = maxI - minI;

		var zoom = 1 - zoomRate;

		minR = centerX - ((rRange / 2) * zoom);
		maxR = centerX + ((rRange / 2) * zoom);

		minI = centerY - ((iRange / 2) * zoom);
		maxI = centerY + ((iRange / 2) * zoom);
	}

	// Now that we've adjusted our parameters, let's redraw the fractal.
	generateMandelbrot();

}


// -------------------------------- Fullscreen Stuff --------------------------------

function toggleFullscreen(){
	onLoad();
	if(!fullscreen){
		enterFullscreen();
	} else {
		exitFullscreen();
	}
}

/*****************************************************************************************************
* This website was initially developed in a viewport of size 1280x667 pixels. It was found 
* that the values:
*	minI: -1.5
*	maxI: 1.5
*
*	minR: -2.8
*	maxR: 2
*
*	rCenter = -0.4
*	iCenter = 0
*
* gave us a good looking fractal. However, aspect ratios aren't always constant, so we need to 
* adjust our values to maintain a good aspect ratio to render the fractal in.
*
* To get the distance between minI and maxI, divide height by 266.6 repeating.
* To get the distance between minR and maxR, divide width  by 225.6 repeating.
*
* These values were determined through the ratios:
*	1280: 4.8  (Height)
*	677 : 2.8  (Width)
*
* To find the min/max values of i/r, we divide height and width by their constants to get the distances.
* We then divide the distances by 2 and add/subtract them from their center value to get the min/max
* values.
* 
*****************************************************************************************************/
function adjustToScreenAspectRatio(){

	var iDistance = height / 483.5814286;
	var rDistance = width / 533.33333;

	minI = -iDistance;
	maxI = iDistance;
	minR = -0.4 - rDistance;
	maxR = -0.4 + rDistance;
}

// Absolute value
function abs(value){
	return Math.abs(value);
}

// Square root
function sqrt(value){
	return Math.sqrt(value);
}

function posCos(value){
	return abs(Math.cos(value));
}

function posSin(value){
    return abs(Math.sin(value));
}

function posTan(value){
    return abs(Math.tan(value));
}
