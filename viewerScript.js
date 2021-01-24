let data = [];
let frameNum = 0;
const canvas = document.getElementById("movieScreen");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext("2d");

function readFile() {
	data = [];
	let files = document.getElementById('uploader').files;
	console.log(files);
	if (files.length <= 0) {
		return false;
	}
	let file = files[0];
	let fr = new FileReader();
	fr.readAsBinaryString(file);
	fr.onload = function(e) {
		let x = fr.result;
		let str = "";
		for (let i = 0; i < x.length; i++) {
			data.push(x.charCodeAt(i));
		}
		console.log(data);
		displayPicture();
		displayFrameNum();
	}
};

function displayPicture() {
	const picnum = data[0];
	const dimx = data[4];
	const dimy = data[8];
	const pictureBlockSize = dimx*dimy;
	
	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.font = "16px Consolas";
	ctx.fillStyle = "white";
	let colours = ["black","blue","green","cyan","red","magenta","yellow","white"];
	let bColour = colours[0];
	let fColour = colours[7];
	let dword = 3 + (frameNum * pictureBlockSize);
	let dword4 = dword*4;
	let charac = "";
	for (let x = 0; x < dimx && x < 80; x++) {
		for (let y = 0; y < dimy && y < 25; y++) {
				fColour = colours[data[dword4+1]];
				bColour = colours[data[dword4+2]];
				ctx.fillStyle = bColour;
				ctx.fillRect(x*8,y*16,(x+1)*8,(y+1)*16);
				ctx.fillStyle = fColour;
				charac = String.fromCharCode(data[dword4]);
				dword++;
				dword4 = dword*4;
				if (charac == "\0" || charac == " ") {
					continue;
				}
				ctx.fillText(charac,x*8,y*16);
				console.log(data[dword4],data[dword4 + 1],data[dword4 + 2],data[dword4 + 3]);
		}
	}
	console.log("G");
}

function incrementFrameNumAndDisplay() {
	frameNum++;
	if (frameNum > data[0]) {
		frameNum = 0;
	}
	displayPicture();
	displayFrameNum();
}

function decrementFrameNumAndDisplay() {
	frameNum--;
	if (frameNum < 0) {
		frameNum = data[0];
	}
	displayPicture();
	displayFrameNum();
}

function displayFrameNum() {
	document.getElementById("FrameDisplayer").innerHTML = "Current Frame: " + frameNum;
}