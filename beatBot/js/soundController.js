function playSound(soundEffectName){
    if(!muted){
        var soundResourcePath = "soundEffects/" + soundEffectName;
        var audio = new Audio(soundResourcePath);
        audio.play();
    }
  }