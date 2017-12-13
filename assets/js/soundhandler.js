var playlist = [];
var bgS = document.getElementById("backgroundSFX");
var SFX = document.getElementsByClassName("SFX");
var SFXstate = true;
bgS.volume = 0.2;
SFX.volume = 1.0;
for(var i = 0; i<3; i++)
    playlist[i] = "./assets/sound/background/"+i+".ogg";
var offset = 0;
bgS.src = playlist[offset];
function changeMusic(){
    if(offset==playlist.length-1)
        offset=0;
    else offset++;
    bgS.src = playlist[offset];
    bgS.play();
}
function resetMusic(){
    offset = -1;
    changeMusic();
}
function stopMusic(){
    bgS.pause();
    bgS.currentTime = 0;
}
function pauseMusic(){
    bgS.pause();
}
function playMusic(){
    bgS.play();
}
function switchSFX(){
	if(SFXstate){
	changeMusic();
	stopMusic();
	SFX.volume = 0;
	SFXstate = false;
	}else{
	playMusic();
	SFX.volume = 1.0;
	SFXstate = true;
	}
}