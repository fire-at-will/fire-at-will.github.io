console.log("Hello from worker!")

//worker.postMessage(imageData, SORT_BY_ROWS, SORT_BY_COLUMNS, SORT_BY_CIRCLES, SORT_INTERVAL, RANDOM_INTERVAL);

var imageData;
var SORT_BY_ROWS;
var SORT_BY_COLUMNS;
var SORT_BY_CIRCLES;
var SORT_INTERVAL;
var RANDOM_INTERVAL;

onmessage = function(e){
  console.log("Received message from main script")
  imageData = e.data[0]
  SORT_BY_ROWS = e.data[1]
  SORT_BY_COLUMNS = e.data[2]
  SORT_BY_CIRCLES = e.data[3]
  SORT_INTERVAL = e.data[4]
  RANDOM_INTERVAL = e.data[5]

  console.log(SORT_BY_ROWS)
  if(SORT_BY_ROWS){
    console.log("Sorting by rows.")

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
          //console.log(i)
          array.push(getPixelData(k * rowInterval + j, i))
        }

        // Sort this interval
        quickSort(array)
        //console.log(array)

        // Replace image pixels with the sorted pixels
        for(j = 0; j < rowInterval; j++){
          setPixelData( (k * rowInterval + j), i, array[j] )
        }

      }

    }
  } else if(SORT_BY_COLUMNS){
    console.log("Sorting by column.");

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
    let midpoint = partition(pixelArray, low, high)

    quickSortAlgorithm(pixelArray, low, midpoint - 1)
    quickSortAlgorithm(pixelArray, midpoint + 1, high)
  }

}

function partition(pixelArray, low, high){

  let pivot = getPixelValue(pixelArray[low])

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
      let temp = pixelArray[leftmark]
      pixelArray[leftmark] = pixelArray[rightmark]
      pixelArray[rightmark] = temp
    }

  }

  let temp = pixelArray[low]
  pixelArray[low] = pixelArray[rightmark]
  pixelArray[rightmark] = temp

  return rightmark
}

function setPixelData(x, y, dataArray){
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

  imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 0] = dataArray[0]
  imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1] = dataArray[1]
  imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2] = dataArray[2]
}

function getPixelData(x, y){
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

  let r = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 0];
  let g = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1];
  let b = imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2];


  return [r, g, b]
}

function getPixelValue(pixelData){
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

  let r = pixelData[0]
  let g = pixelData[1]
  let b = pixelData[2]
  return r + g + b
}
