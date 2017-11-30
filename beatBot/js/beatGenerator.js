var tempBeatMap = [];

function getBeatMap(activeBeats, totalBeats){
    var remainder = [];
    var count = [];

    // Reset public beat map
    tempBeatMap = [];

    var divisor = totalBeats - activeBeats;
    remainder.push(parseInt(activeBeats));
    var level = 0;
    do{
      count[level] = Math.floor(divisor / remainder[level]);
      remainder[level + 1] = divisor % remainder[level];
      divisor = remainder[level];
      level = level + 1;
    } while(remainder[level] > 1);

    count[level] = divisor;

    buildString(level, count, remainder);

    console.log("Returning:");
    console.log(tempBeatMap);
    return tempBeatMap;
}

function buildString(level, count, remainder){
    if(level === -1){
      // Append false
      tempBeatMap.push(false);
    } else if(level === -2){
      // Append true
      tempBeatMap.push(true);
    } else {
      for(var i = 0; i < count[level]; i++){
        buildString(level - 1, count, remainder);
      }

      if(remainder[level] !== 0){
        buildString(level - 2, count, remainder);
      }
    }
  }