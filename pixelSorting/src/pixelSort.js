var SORT_BY_ROWS = false;
var SORT_BY_COLUMNS = false;
var SORT_BY_CIRCLES = false;
var SORT_INTERVAL = 200;
var RANDOM_INTERVAL = true;

var sortName = "";

var sortButton      = document.getElementById('sort-button');
var resetButton     = document.getElementById('reset-button');
var downloadButton  = document.getElementById('download-button');
var progressLabel   = document.getElementById('progressLabel');
var progressBar     = document.getElementById('progressBar');
var imageItem       = document.getElementById('imageItem');

downloadButton.addEventListener('click', function (e) {
    console.log("Download...");
    var dataURL = canvas.toDataURL('image/png');
    downloadButton.download = "image.png";
    downloadButton.href = dataURL;
});

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
imageLoader.onclick = function () {
    this.value = null;
};

$("#instructionsLink").click(function() {
  $(".mdl-layout").animate({scrollTop: Math.floor($("#instructions").offset().top) - 20}, 1000, "swing");
});

var canvas = document.createElement('canvas');

var image = new Image();
var imageData;
var originalImageData;

var ctx = canvas.getContext('2d');

function drawImage(imageData){
  ctx.putImageData(imageData, 0, 0);
  imageItem.src = canvas.toDataURL();
  progressBar.className = "mdl-progress mdl-js-progress"
}

function resetImage(){
  drawImage(originalImageData);
}

function handleImage(e){
  ctx.clearRect(0,0,canvas.width,canvas.height);

    var fileReader = new FileReader();
    fileReader.onload = function(e) {
       var img = new Image();

       img.onload = function() {

          // Set width and height
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw to canvas
          ctx.drawImage(img, 0, 0);

          // Put canvas onto img
          imageItem.src = canvas.toDataURL();

          // Enable Sort button
          sortButton.removeAttribute("disabled");

          // Enable download button
          downloadButton.removeAttribute("disabled");
          image = img;
          // Get image data
          var tempCanvas = document.createElement('canvas');   // Create new canvas in memory. Otherwise we get the downsized image.

          originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
       };
       img.src = e.target.result;

    };
    imageItem.src = e.target.files[0];
    fileReader.readAsDataURL(e.target.files[0] );
}

function sortImage(){
  sortButton.setAttribute('disabled', 'disabled');
  progressBar.MaterialProgress.setProgress(100);
  progressBar.className = "mdl-progress mdl-js-progress mdl-progress__indeterminate";
  getSettingValues();

  // Display progress div
  var progressDiv = document.getElementById('progressDiv');
  progressDiv.style.display = 'block';

  if (window.Worker) {

    // Get image data
    var tempCanvas = document.createElement('canvas');   // Create new canvas in memory. Otherwise we get the downsized image.

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var worker = new Worker("src/sort.js");
    worker.postMessage([imageData, SORT_BY_ROWS, SORT_BY_COLUMNS, SORT_BY_CIRCLES, SORT_INTERVAL, RANDOM_INTERVAL]);

    worker.addEventListener('message', function(e) {
      // Log the workers message.
      if(e.data[0] == 0){
        // Update on row or column status
        progressLabel.innerText = "Sorting " + sortName + " " + (e.data[1] + 1) + "/" + e.data[2];

      } else if(e.data[0] == 1) {
        // Sort complete
        drawImage(e.data[1]);
        progressLabel.innerText = "Done!";
        sortButton.removeAttribute("disabled");
        resetButton.removeAttribute("disabled");
      } else if(e.data[2] == 2){
        // Update on circle status
        progressLabel.innerText = "Sorting circle " + e.data;
      }

    }, false);

  } else {
    alert("Your browser does not support web workers. We'll hopefully add support for you in a bit. :)");
  }
}

function getSettingValues(){

  // Clear values
  SORT_BY_ROWS      = false;
  SORT_BY_COLUMNS   = false;
  SORT_BY_CIRCLES   = false;

  // Get sort by setting
  var selectedVal = "";
  var selected = $("input[type='radio'][name='sort-by-settings']:checked");
  if (selected.length > 0) {
      selectedVal = selected.val();
  }
  selectedVal = parseInt(selectedVal);

  switch (selectedVal) {
    case 1:
      SORT_BY_ROWS = true;
      sortName = "row";
      break;
    case 2:
      SORT_BY_COLUMNS = true;
      sortName = "column";
      break;
    case 3:
      SORT_BY_CIRCLES = true;
      sortName = "circle";
      break;
    default:
      break;
  }

  // Get sort interval
  SORT_INTERVAL = parseInt(document.getElementById('sortIntervalInput').value)

  // Get RANDOM_INTERVAL boolean
  RANDOM_INTERVAL = document.getElementById('random-interval-switch').checked
}
