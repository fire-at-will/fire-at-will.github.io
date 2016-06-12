var SORT_BY_ROWS = false;
var SORT_BY_COLUMNS = false;
var SORT_BY_CIRCLES = false;
var SORT_INTERVAL = 200;
var RANDOM_INTERVAL = true;

var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

//var canvas = document.getElementById('imageCanvas');
var canvas = document.createElement('canvas')
var canvasDiv = document.getElementById('canvasDiv');
//canvas.width = canvasDiv.clientWidth;
//canvas.height = canvasDiv.clientHeight;

var image = new Image();
var img = new Image();
var imageData;

var ctx = canvas.getContext('2d');

function drawImage(imageData){
  ctx.putImageData(imageData, 0, 0);
  imageItem.src = canvas.toDataURL()
  //imageItem.style.height = img.height + 'px;'
}

function handleImage(e){
  ctx.clearRect(0,0,canvas.width,canvas.height);

    var fileReader = new FileReader();
    fileReader.onload = function(e) {
       var img = new Image();

       img.onload = function() {

            var imageItem = document.getElementById('imageItem');

            // Set width and height
            canvas.width = img.width
            canvas.height = img.height

            // Draw to canvas
            ctx.drawImage(img, 0, 0)

            // Put canvas onto img
            imageItem.src = canvas.toDataURL()

         image = img
       };
       img.src = e.target.result;

    };
    fileReader.readAsDataURL(e.target.files[0] );
}

function sortImage(){
  getSettingValues();

  if (window.Worker) {

    // Get image data
    var tempCanvas = document.createElement('canvas');   // Create new canvas in memory. Otherwise we get the downsized image.
    var context = tempCanvas.getContext('2d');

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var worker = new Worker("src/sort.js");
    worker.postMessage(imageData, SORT_BY_ROWS, SORT_BY_COLUMNS, SORT_BY_CIRCLES, SORT_INTERVAL, RANDOM_INTERVAL);

  }
}

function getSettingValues(){

  // Clear values
  SORT_BY_ROWS      = false
  SORT_BY_COLUMNS   = false
  SORT_BY_CIRCLES   = false

  // Get sort by setting
  var selectedVal = "";
  var selected = $("input[type='radio'][name='sort-by-settings']:checked");
  if (selected.length > 0) {
      selectedVal = selected.val();
  }
  selectedVal = parseInt(selectedVal)

  switch (selectedVal) {
    case 1:
      SORT_BY_ROWS = true
      break;
    case 2:
      SORT_BY_COLUMNS = true
      break;
    case 3:
      SORT_BY_CIRCLES = true
      break;
    default:
      break;
  }

  // Get sort interval
  SORT_INTERVAL = parseInt(document.getElementById('sortIntervalInput').value)

  // Get RANDOM_INTERVAL boolean
  RANDOM_INTERVAL = document.getElementById('random-interval-switch').checked
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
