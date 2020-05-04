
function Sound(sourceOgg, sourceMp3){
    this.audio = new Audio();
    if(this.audio.canPlayType("audio/mpeg")){
        this.audio.src=sourceMp3;
    }else if(this.audio.canPlayType("audio/ogg")){
        this.audio.src=sourceOgg;
    }
}

Sound.prototype.play = function(){
    this.audio.play();
}