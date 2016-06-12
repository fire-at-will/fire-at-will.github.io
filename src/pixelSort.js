var SORT_BY_ROWS = false;
var SORT_BY_COLUMNS = false;
var SORT_BY_CIRCLES = false;
var SORT_INTERVAL = 200;
var RANDOM_INTERVAL = true;

var sortName = ""

var sortButton = document.getElementById('sort-button');

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

            // Enable Sort button
            sortButton.removeAttribute("disabled")
         image = img
       };
       img.src = e.target.result;

    };
    fileReader.readAsDataURL(e.target.files[0] );
}

function sortImage(){
  getSettingValues();

  // Display progress div
  var progressDiv = document.getElementById('progressDiv');
  progressDiv.style.display = 'block'

  if (window.Worker) {

    // Get image data
    var tempCanvas = document.createElement('canvas');   // Create new canvas in memory. Otherwise we get the downsized image.
    var context = tempCanvas.getContext('2d');

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var worker = new Worker("src/sort.js");
    worker.postMessage([imageData, SORT_BY_ROWS, SORT_BY_COLUMNS, SORT_BY_CIRCLES, SORT_INTERVAL, RANDOM_INTERVAL]);

    worker.addEventListener('message', function(e) {
      // Log the workers message.
      if(e.data[0] == 0){
        // Update on status
        console.log("Update")
        var progressLabel = document.getElementById('progressLabel');
        progressLabel.innerText = "Sorting " + sortName + " " + (e.data[1] + 1) + "/" + e.data[2];

        var progressBar = document.getElementById('progressBar');
        progressBar.MaterialProgress.setProgress( (e.data[1] + 1 / e.data[2]) * 100);

      } else {
        // Sort complete
        drawImage(e.data[1])
        progressLabel.innerText = "Done!";
      }

    }, false);

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
      sortName = "row"
      break;
    case 2:
      SORT_BY_COLUMNS = true
      sortName = "column"
      break;
    case 3:
      SORT_BY_CIRCLES = true
      sortName = "circle"
      break;
    default:
      break;
  }

  // Get sort interval
  SORT_INTERVAL = parseInt(document.getElementById('sortIntervalInput').value)

  // Get RANDOM_INTERVAL boolean
  RANDOM_INTERVAL = document.getElementById('random-interval-switch').checked
}
