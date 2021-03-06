var imageData;
var SORT_BY_ROWS;
var SORT_BY_COLUMNS;
var SORT_BY_CIRCLES;
var SORT_INTERVAL;
var RANDOM_INTERVAL;

onmessage = function(e){
  imageData = e.data[0]
  SORT_BY_ROWS = e.data[1]
  SORT_BY_COLUMNS = e.data[2]
  SORT_BY_CIRCLES = e.data[3]
  SORT_INTERVAL = e.data[4]
  RANDOM_INTERVAL = e.data[5]

  if(SORT_BY_ROWS){
    console.log("Sorting by rows.")

    if(SORT_INTERVAL > imageData.width){
      SORT_INTERVAL = imageData.width;
    }

    for(i = 0; i < imageData.height; i++){

      self.postMessage([0, i, imageData.height]);

      var rowInterval = SORT_INTERVAL
      if(RANDOM_INTERVAL){
        // Create a random number x where 2 < x < SORT_INTERVAL
        rowInterval = Math.floor((Math.random() * SORT_INTERVAL) + 2);
      }

      var endOfLine = imageData.width

      // How many sections we have to sort in each row
      var loops = Math.floor(imageData.width / rowInterval)
      for(k = 0; k < loops; k++){
        var array = []

        // Get the next pixels to sort in the interval
        for(j = 0; j < rowInterval; j++){
          array.push(getPixelData(k * rowInterval + j, i))
        }

        // Sort this interval
        quickSort(array)

        // Replace image pixels with the sorted pixels
        for(j = 0; j < rowInterval; j++){
          setPixelData( (k * rowInterval + j), i, array[j] )
        }

      }

    }
  } else if(SORT_BY_COLUMNS){
    console.log("Sorting by columns.");

    if(SORT_INTERVAL > imageData.height){
      SORT_INTERVAL = imageData.height;
    }

    for(i = 0; i < imageData.width; i++){
      self.postMessage([0, i, imageData.width]);

      var columnInterval = SORT_INTERVAL;
      if(RANDOM_INTERVAL){
        columnInterval = Math.floor((Math.random() * SORT_INTERVAL) + 2)
      }

      var endOfLine = imageData.height

      // How many sections we have to sort in each column
      var loops = Math.floor(imageData.height / columnInterval);

      for(k = 0; k < loops; k++){
        // For each pixel in column sections
        var array = []

        for(j = 0; j < columnInterval; j++){
          array.push(getPixelData(i, k * columnInterval + j))
        }

        quickSort(array)

        for(j = 0; j < columnInterval; j++){
          setPixelData(i, (k * columnInterval + j), array[j] )
        }
      }
    }
  } else if(SORT_BY_CIRCLES){
    console.log("Sorting by circles.")

    var radius = 1
    var centerX = Math.floor(imageData.width / 2);
    var centerY = Math.floor(imageData.height / 2);

    var originalInterval = SORT_INTERVAL;

    while(radius < centerX){
      // For each radius size, do...

      self.postMessage([2, radius, centerX]);

      var array = []

      var minX = Math.floor(centerX - radius)
      var maxX = Math.floor(centerX + radius)

      // Top half of circle
      for(x = minX; x < maxX; x++){
        array.push(getPixelData(x, (centerY + circleEquation("positive", x, centerX, radius) ) ) )
      }

      // Bottom half of circle
      for(x = minX; x < maxX; x++){
        array.push( getPixelData( x, (centerY + circleEquation("negative", x, centerX, radius) ) ) )
      }

      // Check for any undefined values (we've gone too far and gone outside the range of the circle)
      var breakOut = false;
      for(x = 0; x < array.length; x++){
        var pixelData = array[x];
        if(pixelData[0] == undefined || pixelData[1] == undefined || pixelData[2] == undefined){
          // Isn't it funny how we can't break out of a while loop while also in a for loop?
          breakOut = true;
          break
        }
      }


      if(breakOut){
        break
      }

      // Sort circle
      quickSort(array)

      // Replace image pixels with sorted pixels
      var arrayIndex = 0

      // Top half of circle
      for(x = minX; x < maxX; x++){
        setPixelData(x, centerY + circleEquation("positive", x, centerX, radius), array[arrayIndex]);
        arrayIndex = arrayIndex + 1
      }

      // Bottom half of circle
      for(x = minX; x < maxX; x++){
        setPixelData(x, centerY + circleEquation("negative", x, centerX, radius), array[arrayIndex]);
        arrayIndex = arrayIndex + 1
      }

      // Increase radius by 1 and repeat
      radius = radius + 2
    }
  }

  // Done sorting!
  console.log("Done!")
  self.postMessage([1, imageData])
  close()
}

function quickSort(pixelArray){
  quickSortAlgorithm(pixelArray, 0, pixelArray.length - 1)
}

function quickSortAlgorithm(pixelArray, low, high){
  if(low < high){
    var midpoint = partition(pixelArray, low, high)

    quickSortAlgorithm(pixelArray, low, midpoint - 1)
    quickSortAlgorithm(pixelArray, midpoint + 1, high)
  }

}

function partition(pixelArray, low, high){

  var pivot = getPixelValue(pixelArray[low])

  var leftmark = low + 1
  var rightmark = high

  var done = false

  while(!done){

    while(leftmark <= rightmark && ( getPixelValue(pixelArray[leftmark]) <= pivot ) ){
      leftmark = leftmark + 1
    }

    while( (getPixelValue(pixelArray[rightmark]) >= pivot ) && rightmark >= leftmark ){
      rightmark = rightmark - 1
    }

    if(rightmark < leftmark){
      done = true
    } else {
      var temp = pixelArray[leftmark]
      pixelArray[leftmark] = pixelArray[rightmark]
      pixelArray[rightmark] = temp
    }

  }

  var temp = pixelArray[low]
  pixelArray[low] = pixelArray[rightmark]
  pixelArray[rightmark] = temp

  return rightmark
}

function circleEquation(mode, x, h, r){
  var y = Math.floor(Math.sqrt( (r * r) - ( (x - h) * (x - h) ) ))

  if(mode == "positive"){
    // Return positive version
    return Math.abs(y)
  } else {
    // Return negative version
    if(y > 0){
      y = y - y - y
    }
    return y
  }
}

function setPixelData(x, y, dataArray){
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

  imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 0] = dataArray[0]
  imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1] = dataArray[1]
  imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2] = dataArray[2]
}

function getPixelData(x, y){
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

  var r = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 0];
  var g = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1];
  var b = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2];

  return [r, g, b]
}

function getPixelValue(pixelData){
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

  var r = pixelData[0]
  var g = pixelData[1]
  var b = pixelData[2]

  return r + g + b
}
