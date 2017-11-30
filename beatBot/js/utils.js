function bpmToMilliseonds(bpm){
    // Calculate the length of each beat in seconds
    var lengthOfBeatInSeconds = 60 / bpm;
    var lengthOfBeatInMilliseconds = lengthOfBeatInSeconds * 1000;

    return lengthOfBeatInMilliseconds;
}