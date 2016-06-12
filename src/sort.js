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
}

if(SORT_BY_ROWS){
  console.log("Sorting by rows.")

  for(i = 0; i < imageData.height; i++){

     //console.log("Processing row: " + i + "/" + imageData.height)

    var rowInterval = SORT_INTERVAL
    if(RANDOM_INTERVAL){
      // Create a random number x where 2 < x < SORT_INTERVAL
      rowInterval = Math.floor((Math.random() * SORT_INTERVAL) + 2);
    }

    var endOfLine = imageData.width

    // How many sections we have to sort in each row
    var loops = Math.floor(imageData.width / rowInterval)
    //console.log(loops)
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
}

// Done sorting!
console.log("Done!")
postMessage([imageData])
close()
