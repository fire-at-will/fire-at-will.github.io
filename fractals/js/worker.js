var minR;
var maxR;

var minI;
var maxI;

var width;
var height;

var maxIterations;

var palatteMode;

var colors;

var pattern;


self.addEventListener('message', function(e) {
    // Get data from manager
    var myID = e.data[0];
    var totalNumberOfWorkers = e.data[1];
    var numberOfRows = e.data[2];
    height = numberOfRows;
    width = e.data[3];
    minI = e.data[4];
    minR = e.data[5];
    maxI = e.data[6];
    maxR = e.data[7];
    maxIterations = e.data[8];
    palatteMode = e.data[9];
    pattern = e.data[10];

    generateSmoothColorPalatte(palatteMode);

    // Calculate what rows we need to process
    var firstRow = firstRowToProcess(myID, totalNumberOfWorkers, numberOfRows);
    var lastRow  = lastRowToProcess(myID, totalNumberOfWorkers, numberOfRows);

    // Process each of our rows
    for(var y = firstRow; y <= lastRow; y++){
        // Get a row of pixels from canvas
        var pixels = [];

        // For each column in the row...
        for(var x = 0; x < width; x++){

            // Map screen coordinates to the real-complex plane
            var cr = mapToReal(x);
            var ci = mapToImaginary(y);

            // Perform mandelbrot sequence on zoomed area
            var result = mandelbrot(cr, ci);
            //var n = result[0];	// Unsmoothed n

            // Get RGB color for value of n
            var color = getPixelColor(result);
            pixels.push(color);

        }
        self.postMessage([pixels, y]);
    }

}, false);

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

function firstRowToProcess(id, totalWorkers, numberOfRows){
    var rowsPerWorker = Math.floor(numberOfRows / totalWorkers);
    return Math.floor(id * rowsPerWorker);
}

function lastRowToProcess(id, totalWorkers, numberOfRows){
    var myFirst = firstRowToProcess(id, totalWorkers, numberOfRows);

    // Calculate stopping point
    var rowsPerWorker = Math.floor(numberOfRows / totalWorkers);
    var myLastRow = myFirst + rowsPerWorker - 1;

    // If we are on the last worker and we've gone too far and assigned this worker
    // a row that doesn't exist, we'll just give it a few less rows to process.
    if(myLastRow > numberOfRows){
        myLastRow = numberOfRows;
    }

    // If we are on the last core and there are still extra is that have not been assigned,
    // just assign them to the last core.
    if((id == totalWorkers - 1) && (myLastRow < numberOfRows)){
        myLastRow = numberOfRows;
    }

    return Math.floor(myLastRow);
}


function getPixelColor(result){

    var n = result[0];

    // Map to RGB
    if(Math.floor(n) == maxIterations){
        return [0, 0, 0];
    }

    switch(palatteMode){
        case 'Blue':
            color = mapIterationToColorBlue(n);
            break;
        case 'Red':
            color = mapIterationToColorRed(n);
            break;
        case 'Green':
            color = mapIterationToColorGreen(n);
            break;
        case 'Purple':
            color = mapIterationToColorPurple(n);
            break;
        case 'smooth':
            color = getSmoothColor(n, result[1], result[2]);
            break;
    }
    return color;
}

function getSmoothColor(n, Tr, Ti){

    var mu = getSmoothedN(n, Tr, Ti);

    if(isNaN(mu)){
        mu = 3;
    }

    var colorIndex = parseInt(mu / maxIterations * 768);
    if (colorIndex >= 768) colorIndex = 0;
    if (colorIndex < 0) colorIndex = 0;

    // console.log(colors[colorIndex]);

    return colors[colorIndex];
}

function generateSmoothColorPalatte(){
    colors = [];

    switch(pattern){
        case 'Smooth Blue':
            // Blue
            for(var i = 0; i < 768; i++){
                var r = 0;
                var g = 0;
                var b = 0;
                if(i >= 512){
                    r = i - 512;
                    g = 255 - r;
                } else if(i >= 256){
                    g = i - 256;
                    b = 255 - g;
                } else {
                    b = i;
                }

                colors[i] = [r, g, b];
            }
            break;

        case 'Smooth Red':
            //Red
            for(var i = 0; i < 768; i++){
                var r = 0;
                var g = 0;
                var b = 0;
                if(i >= 512){
                    g = i - 512;
                    r = 255 - g;
                } else if(i >= 256){
                    b = i - 256;
                    g = 255 - b;
                } else {
                    r = i;
                }

                colors[i] = [r, g, b];
            }
            break;

        case 'White on Black':
            // B&W
            for(var i = 0; i < 768; i++){
                var r = 0;
                var g = 0;
                var b = 0;
                if(i >= 512){
                    r = i % 768;
                    g = i % 768;
                    b = i % 768;
                } else if(i >= 256){
                    r = i % 768;
                    g = i % 768;
                    b = i % 768;
                } else {
                    r = parseInt(i / 768);
                    g = parseInt(i / 768);
                    b = parseInt(i / 768);
                }

                colors[i] = [r, g, b];
            }
            break;
        case 'White on Sky Blue':
            // B&W
            for(var i = 0; i < 768; i++){
                var r = 0;
                var g = 0;
                var b = 0;
                if(i >= 512){
                    r = i % 768;
                    g = i % 768;
                    b = i % 768;
                } else if(i >= 256){
                    r = i % 768;
                    g = i % 768;
                    b = i % 768;
                } else {
                    r = parseInt(i / 768);
                    g = parseInt(256 - i);
                    b = parseInt(256 - i);
                }

                colors[i] = [r, g, b];
            }
            break;
        case 'Smooth Grayscale':
            // Grayscale
            for(var i = 0; i < 768; i++){
                var r = 0;
                var g = 0;
                var b = 0;
                if(i >= 512){
                    r = i - (i / 2)
                    g = i - (i / 2)
                    b = i - (i / 2)
                } else if(i >= 256){
                    r = i - (i / 2)
                    g = i - (i / 2)
                    b = i - (i / 2)
                } else {
                    r = i - (i / 2)
                    g = i - (i / 2)
                    b = i - (i / 2)
                }

                colors[i] = [r, g, b];
            }
            break;
        case 'Bob Marley':
            // Bob Marley
            for(var i = 0; i < 768; i++){
                var r = 0;
                var g = 0;
                var b = 0;
                if(i >= 512){
                    r = (i * i) % 768;
                    g = (i * i * i) % 768;
                    b = i % 768;
                } else if(i >= 256){
                    r = (i * i) % 768;
                    g = (i * i * i) % 768;
                    b = i % 768;
                } else {
                    r = (i * i * i) % 768;
                    g = (i * i) % 768;
                    b = i % 768;
                }

                colors[i] = [r, g, b];
            }
            break;
        case 'Red on Black':
            for(var i = 0; i < 768; i++){
                var r = 0;
                var g = 0;
                var b = 0;
                if(i >= 512){
                    r = 255;
                    g = 34 + (i % 40);
                    b = 12 + (i % 20);
                } else if(i >= 256){
                    r = 255;
                    g = 34 + (i % 20);
                    b = 0 + (i % 40);
                } else {
                    r = parseInt(i / 768);
                    g = parseInt(i / 768);
                    b = parseInt(i / 768);
                }

                colors[i] = [r, g, b];
            }
            break;
        case 'Experimental':
            for(var i = 0; i < 768; i++){
                var r = 0;
                var g = 0;
                var b = 0;
                if(i >= 512){
                    r = (i * i * i) % 768;
                    g = 256 - i;
                    b = i % 768;
                } else if(i >= 256){
                    r = (i * i) % 768;
                    g = (i * i * i) % 768;
                    b = i % 768;
                } else {
                    r = parseInt(256 - i);
                    g = parseInt(i / 768);
                    b = parseInt(256 - i);
                }

                colors[i] = [r, g, b];
            }
            break;
    }

}



function mapIterationToColorPurple(iteration){
    var color = {};
    color[0] = iteration * 7919 % 255; 		// R
    color[1] = 60;							// G
    color[2] = iteration * 7919 % 255;		// B

    return color;
}

function mapIterationToColorBlue(iteration){
    var color = {};
    color[0] = Math.floor(iteration * 7919 % 255); 		// R
    color[1] = Math.floor(iteration * 7919 % 255);		// G
    color[2] = 210;							// B

    return color;
}

function mapIterationToColorRed(iteration){
    var color = {};
    color[0] = 210;					 		// R
    color[1] = iteration * 7919 % 255;		// G
    color[2] = iteration * 7919 % 255;		// B

    return color;
}

function mapIterationToColorGreen(iteration){
    var color = {};
    color[0] = iteration * 7919 % 255;		// R
    color[1] = 210;							// G
    color[2] = iteration * 7919 % 255;		// B

    return color;
}

function getSmoothedN(n, Tr, Ti){
    var logBase = 1.0 / Math.log(2.0);
    var logHalfBase = Math.log(0.5)*logBase;
    return 5 + n - logHalfBase - Math.log(Math.log(Tr+Ti))*logBase;
}

function isColorModeSmooth(colorMode){
    if(smoothColors.indexOf(colorMode) <= -1){
        console.log('Color mode ' + colorMode + ' is not smooth.');
        return false;
    } else {
        console.log('Color mode ' + colorMode + ' is smooth.');
        return true;
    }
}

function performAntialiasing(pixels, width, height){
    var x;
    var y;

    for(x = 0; x < width; x++){
        for(y = 0; y < height; y++){

            // Get pixels
            var above  = getAbove(x, y);
            var below  = getBelow(x, y);
            var left   = getLeft(x, y);
            var right  = getRight(x, y);
            var center = pixels[indexForCoords(x, y)];

            // Calculate RGB average for all relevant pixels
            var count = 1;

            if(above != null){
                center[0] += above[0];
                center[1] += above[1];
                center[2] += above[2];
                count++;
            }
            if(below != null){
                center[0] += below[0];
                center[1] += below[1];
                center[2] += below[2];
                count++;
            }
            if(left != null){
                center[0] += left[0];
                center[1] += left[1];
                center[2] += left[2];
                count++;
            }
            if(right != null){
                center[0] += right[0];
                center[1] += right[1];
                center[2] += right[2];
                count++;
            }

            center[0] = parseInt(center[0] / count);
            center[1] = parseInt(center[1] / count);
            center[2] = parseInt(center[2] / count);

            // Set pixels to have avg pixel
            pixels[indexForCoords(x, y)] = center;
        }
    }

    return pixels;

    function getAbove(x, y){
        if(y == 0){
            return null;
        } else {
            return pixels[indexForCoords(x, y - 1)];
        }
    }

    function getBelow(x, y){
        if(y == height - 1){
            return null;
        } else {
            return pixels[indexForCoords(x, y + 1)];
        }
    }

    function getLeft(x, y){
        if(x == 0){
            return null;
        } else {
            return pixels[indexForCoords(x - 1, y)];
        }
    }

    function getRight(x, y){
        if(x == 0){
            return null;
        } else {
            return pixels[indexForCoords(x + 1, y)];
        }
    }

    function indexForCoords(x, y){
        return (y * width) + x;
    }
}