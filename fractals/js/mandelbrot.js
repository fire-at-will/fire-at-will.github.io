function generateMandelbrot(){

	var pixels;

	// Ensure that height and width are up to date
	height 		= window.innerHeight;
	width		= window.innerWidth;

	// For each row...
	for(var y = 0; y < height; y++){

		// Get a row of pixels from canvas
		pixels = getPixelRow();
		var offset = 0;

		// For each column...
		for(var x = 0; x < width; x++){

			// Map screen coordinates to the real-complex plane
			var cr = mapToReal(x);
			var ci = mapToImaginary(y);

			// Perform mandelbrot sequence on zoomed area
			var result = mandelbrot(cr, ci);
			//var n = result[0];	// Unsmoothed n
			
			// Get RGB color for value of n
			var color = getPixelColor(result);

			pixels.data[offset++] = color[0];	// R
			pixels.data[offset++] = color[1];	// G
			pixels.data[offset++] = color[2];	// B
			pixels.data[offset++] = 255;		// Alpha
				
		}

		// Draw row to screen
		drawPixelRow(pixels, y);
	}
}

function mandelbrot(x, y){

	var i = 0;
	var zReal = 0.0;
	var zImaginary = 0.0;
	var zrSquared = 0;
	var ziSquared = 0;

	// Ensure that we are within bounds and haven't exceeded maxIterations
	for ( ; i<maxIterations && (zrSquared + ziSquared)<=4; ++i ) {
		zImaginary = 2 * zReal * zImaginary + y;
		zReal = zrSquared - ziSquared + x;
		zrSquared = zReal * zReal;
		ziSquared = zImaginary * zImaginary
	}

	return [i, zrSquared, ziSquared];
}

function mapToReal(x){
	var range = maxR - minR;
	return x * (range / width) + minR;
}

function mapToImaginary(y){
	var range = maxI - minI;
	return y * (range / height) + minI;
}

function mapScreenPixelsToCoordinatePlane(pixel, maxPixel, planeMin, planeMax){
	var range = planeMax - planeMin;
	var positionOnPixels = pixel / maxPixel;
	var planeOffset = range * positionOnPixels;

	return planeMin + planeOffset;
}