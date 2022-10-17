let time = -1;
let finaltime = -1;
let lastTime = 0;
let dummySize = null;
let cmvPlayback = false;
let interval;
const slider = document.getElementById("timeSlider");
const timeShow = document.getElementById("currentTimeHolder");
const musicUploader = document.getElementById('musicUploader');

slider.oninput = function() {
  timeShow.innerHTML = "Current Time: " + this.value;
  time = this.value;
  displayFrame();
}

musicUploader.addEventListener("change", function() {
	uploadMusic();
});

function getDummyData() {
	const dummyStartByte = 12 + dimx*dimy*picnummax*4;
	console.log(dummyStartByte);
	dummySize = readBytes(dummyStartByte,4);
	console.log(dummySize);
	let i = 4;
	for (let f = 0; f < dummySize; f++) {
		let Frame = {"picture":null, "start":null, "stop":null, "sound":null, "song":null, "effect":null, "flag":null};
		Frame.picture = readBytes(dummyStartByte + i,2);
		i += 2;
		Frame.start = readBytes(dummyStartByte + i,4);
		i += 4;
		Frame.stop = readBytes(dummyStartByte + i,4);
		i += 4;
		Frame.sound = readBytes(dummyStartByte + i,2);
		i += 2;
		Frame.song = readBytes(dummyStartByte + i,2);
		i += 2;
		Frame.effect = readBytes(dummyStartByte + i,2);
		i += 2;
		Frame.flag = readBytes(dummyStartByte + i,2);
		i += 2;
		frameSet.push(Frame);
		if (Frame.stop > finaltime) {
			finaltime = Frame.stop;
			slider.max = finaltime;
		}
	}
}

function displayFrame() {
	let framesDisplayingAtCurrentTime = [];
	for (let k = 0; k < dummySize; k++) {
		if (frameSet[k].start <= time && time <= frameSet[k].stop) {
			let fsk = frameSet[k];
			fsk.num = k;
			framesDisplayingAtCurrentTime.push(fsk);
		}
	}
	let picture = getPictureFromFrame(framesDisplayingAtCurrentTime);
	
	showFrameDetails(framesDisplayingAtCurrentTime);
	
	let i = 0;
	for (let x = 0; x < dimx && x < 80; x++) {
		for (let y = 0; y < dimy && y < 25; y++) {
			displayCharacter(picture.slice(i,i+4),x,y);
			i += 4;
		}
	}
}

function showFrameDetails(frameAtTime) {
	frameDetailer = document.getElementById("frame-detailer");
	let innerhtml = "";
	for (let f = 0; f < frameAtTime.length; f++) {
		/* Sound Songs and Effect are unimplemented
		if (frameAtTime[f].sound == 65535) frameAtTime[f].sound = -1;
		if (frameAtTime[f].song == 65535) frameAtTime[f].song = -1;
		if (frameAtTime[f].effect == 65535) frameAtTime[f].effect = -1;
		 */
		innerhtml += "<p> Frame Number: " + frameAtTime[f].num + " ";
		innerhtml += "Picture: " + frameAtTime[f].picture + " ";
		innerhtml += "Start: " + frameAtTime[f].start + " ";
		innerhtml += "Stop: " + frameAtTime[f].stop + " ";
		/* 		
		innerhtml += "Sound: " + frameAtTime[f].sound + "<br>";
		innerhtml += "Song: " + frameAtTime[f].song + "<br>";
		innerhtml += "Effect: " + frameAtTime[f].effect + "<br>"; 
		*/
		innerhtml += "Flag: " + frameAtTime[f].flag + "</p>";
	}
	frameDetailer.innerHTML = innerhtml;
}

function getPictureFromFrame(FrameData) {
	let picy = [];
	for (let p = 0; p < FrameData.length; p++) {
		picy.push(pictures[FrameData[p].picture]);
	}
	let pictureToDisplay = [];
	let i = 0;
	let charToDisplay = [0,0,0,0];
	for (let x = 0; x < dimx && x < 80; x++) {
		for (let y = 0; y < dimy && y < 25; y++) {
			for (let p = picy.length - 1; p >= 0; p--) {
				charToDisplay = [0,0,0,0];
				if (FrameData[p].flag == 0 || (picy[p][i] != 0 && picy[p][i] != 32)) {
					for (let j = 0; j < charToDisplay.length; j++) {
						charToDisplay[j] = picy[p][i+j];
					}
					break;
				}
			}
			for (let j = 0; j < charToDisplay.length; j++) {
				pictureToDisplay.push(charToDisplay[j]);
			}
			//displayCharacter(pictureToDisplay.slice(i,i+4),x,y);
			i += 4;
		}
	}
	return pictureToDisplay;
}

function playCMV() {
	cmvPlayback = !cmvPlayback
	if (cmvPlayback) {
		interval = setInterval(incrementTimer,25);
		if (document.getElementById("audioSrc").getAttribute("src") != "") {
			document.getElementById("music").play();
		}
	}
	else {
		clearInterval(interval)
		if (document.getElementById("audioSrc").getAttribute("src") != "") {
			document.getElementById("music").pause();
		}
	}
}

function incrementTimer() {
	slider.value++;
	timeShow.innerHTML = "Current Time: " + slider.value;
	time = slider.value;
	displayFrame();
	if (slider.value >= finaltime) {
		cmvPlayback = false;
		clearInterval(interval);
	}
}

function uploadMusic() {
	let files = musicUploader.files;
	console.log(files);
	if (files.length <= 0) {
		return false;
	}
	let file = files[0];
	let fr = new FileReader();
	fr.onload = function(e) {
		document.getElementById("audioSrc").setAttribute("src", e.target.result);
		document.getElementById("music").load();
	}
	fr.readAsDataURL(files[0]);
	console.log(file, file.type);
}

function toggleEditing2() {
	if (editMode) {
		document.getElementById("picture-editor").style.display = "none";
		document.getElementById("frame-editor").style.display = "inline-block";
		document.getElementById("toggle-edit-button").innerHTML = "Edit Pictures";
		displayFrame();
		editMode = false;
		return;
	}
	else {
		editMode = true;
		document.getElementById("picture-editor").style.display = "inline-block";
		document.getElementById("frame-editor").style.display = "none";
		document.getElementById("toggle-edit-button").innerHTML = "Edit Framedata";
		showCursor();
		showCharacterEdit("hover");
	}
}