var muted = false;

var numberOfTracks = 5;

var beatMap = new Array();
var soundMap = ["Thump.mp3", "Piano Jab.mp3", "Click.mp3", "Timbales.mp3", "Picked Bass.mp3"];

var beatTracker = [0, 0, 0, 0, 0];
var totalCounts = [0, 0, 0, 0, 0];
var trackDisabled = [false, false, false, false, false];

var bpm = 260;    // BPM

// Run right after onload() occurs
function init(){
    // Get our initial beat maps
    updateBeatMaps();

    // Initiate the beat sequence
    scheduleNextBeat();
}

function muteToggled(){
    muted = !muted;
}

function onBeat(){
    // Play any necessary sounds
    for(var i = 0; i < numberOfTracks; i++){
        // Load the current beat from the beat tracker
        var currentBeat = beatTracker[i];
        // Are we on an active beat for this track?
        if(beatMap[i][currentBeat] === true && trackDisabled[i] !== true){
            playSound(soundMap[i]);
        }

        // Increment the current beat to represent the next beat
        currentBeat = currentBeat + 1;

        // If needed, reset the next beat to 0.
        if(currentBeat >= totalCounts[i]){
            currentBeat = 0;
        }

        // Save the next beat into the beat tracker
        beatTracker[i] = currentBeat;
    }



    // Schedule the next beat
    scheduleNextBeat();
}

function updateBeatMaps(){
    var activeBeats1 = document.getElementById('activeBeats1').value;
    var totalBeats1  = document.getElementById('totalBeats1').value;

    totalCounts[0] = totalBeats1;

    var activeBeats2 = document.getElementById('activeBeats2').value;
    var totalBeats2  = document.getElementById('totalBeats2').value;

    totalCounts[1] = totalBeats2;

    var activeBeats3 = document.getElementById('activeBeats3').value;
    var totalBeats3  = document.getElementById('totalBeats3').value;

    totalCounts[2] = totalBeats3;

    var activeBeats4 = document.getElementById('activeBeats4').value;
    var totalBeats4  = document.getElementById('totalBeats4').value;

    totalCounts[3] = totalBeats4;

    var activeBeats5 = document.getElementById('activeBeats5').value;
    var totalBeats5  = document.getElementById('totalBeats5').value;

    totalCounts[4] = totalBeats5;

    beatMap[0] = getBeatMap(activeBeats1, totalBeats1);
    beatMap[1] = getBeatMap(activeBeats2, totalBeats2);
    beatMap[2] = getBeatMap(activeBeats3, totalBeats3);
    beatMap[3] = getBeatMap(activeBeats4, totalBeats4);
    beatMap[4] = getBeatMap(activeBeats5, totalBeats5);

}

function scheduleNextBeat(){
    var beatLengthInMilliseconds = bpmToMilliseonds(bpm);
    window.setTimeout(onBeat, beatLengthInMilliseconds);
}