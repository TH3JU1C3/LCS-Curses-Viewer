let data = [];
let pictures = [];
let frameNum = 0;
let lastTime = 0;
let editingCell = {"x":0,"y":0};
let editMode = false;
const canvas = document.getElementById("movieScreen");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext("2d");

class Frame {
	constructor(dat,) {
		
	}
}

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
		pictures = readPictures();
		console.log(data);
		//clearScreen();
		resetFrame();
		displayPicture();
	}
};

function readBytes(index,size) {
	let bytes = []
	for (let i = size - 1; i >= 0; i--) {
		bytes.push(data[index + i]);
	}
	let number = 0;
	let power = size - 1;
	for (let i = 0; i < bytes.length; i++) {
		number += bytes[i] * Math.pow(256,power);
		power--;
	}
	return number;
}

function readPictures() {
	const picnum = readBytes(0,4);
	const dimx = readBytes(4,4);
	const dimy = readBytes(8,4);
	const pictureBlockSize = dimx*dimy;
	let dword = 0;
	let dword4 = dword*4;
	let pictures = [];
	let picture = [];
	for (let i = 0; i < picnum; i++) {
		dword = 3 + (i * pictureBlockSize);
		dword4 = dword*4;
		for (let x = 0; x < dimx && x < 80; x++) {
			for (let y = 0; y < dimy && y < 25; y++) {
				picture.push(data[dword4    ]);
				picture.push(data[dword4 + 1]);
				picture.push(data[dword4 + 2]);
				picture.push(data[dword4 + 3]);
				dword++;
				dword4 = dword*4;
			}
		}
		pictures.push(picture);
		picture = [];
	}
	return pictures;
}

function displayPicture() {
	const dimx = readBytes(4,4);
	const dimy = readBytes(8,4);
	let picture = pictures[frameNum];
	
	//clearScreen();
	ctx.font = "16px Consolas";
	ctx.fillStyle = "white";
	let colours = ["black","blue","green","cyan","red","purple","yellow","white"];
	let brightColours = ["#808080","#8080FF","#80FF80","#80FFFF","#FF8080","#A64CA6","#FFFF80","#FFFFFF"];
	let bright = false;
	let bColour = colours[0];
	let fColour = colours[7];
	let charac = "";
	
	let i = 0;
	for (let x = 0; x < dimx && x < 80; x++) {
		for (let y = 0; y < dimy && y < 25; y++) {
			charac = String.fromCharCode(convert437ToUTF(picture[i]));
			fColour = colours[picture[i+1]];
			bColour = colours[picture[i+2]];
			if (picture[i+3] == 1) {
				bright = true;
				fColour = brightColours[picture[i+1]];
			}
			else {
				bright = false;
			}
			ctx.fillStyle = bColour;
			ctx.fillRect(x*8,y*16,(x+1)*8,(y+1)*16);
			ctx.fillStyle = fColour;
			ctx.fillText(charac,x*8,y*16,8);
			i += 4;
		}
	}
	console.log("G");
}

function editing() {
	if (editMode) {
		return;
	}
	else {
		editMode = true;
	}
	const dimx = readBytes(4,4);
	const dimy = readBytes(8,4);
	document.addEventListener("keydown", event => {
		switch (event.keyCode) {
			case 32: // Space
				pictures[frameNum][0 + (editingCell["y"] + editingCell["x"]*dimy) * 4] = 80; // Press P for Pain
				pictures[frameNum][1 + (editingCell["y"] + editingCell["x"]*dimy) * 4] = 7;
				pictures[frameNum][2 + (editingCell["y"] + editingCell["x"]*dimy) * 4] = 0;
				displayPicture();
				break;
			case 37: // Left
				if (editingCell["x"] != 0) {
					editingCell["x"]--;
				}
				break;
			case 38: // Up
				if (editingCell["y"] != 0) {
					editingCell["y"]--;
				}
				break;
			case 39: // Right
				if (editingCell["x"] != dimx) {
					editingCell["x"]++;
				}
				break;
			case 40: // Down
				if (editingCell["y"] != dimy) {
					editingCell["y"]++;
				}
				break;
		}
		//Time.sleep(20);
		console.log(editingCell);
	})
}

function incrementFrameNumAndDisplay() {
	resetted = false;
	frameNum++;
	if (frameNum >= data[0]) {
		//clearScreen();
		frameNum = 0;
		resetted = true;
	}
	displayPicture();
	displayFrameNum();
	return resetted;
}

function decrementFrameNumAndDisplay() {
	resetted = false;
	frameNum--;
	if (frameNum < 0) {
		//clearScreen();
		frameNum = data[0]-1;
		resetted = true;
	}
	displayPicture();
	displayFrameNum();
	return resetted;
}

function resetFrame() {
	frameNum = 0;
	displayFrameNum();
}

function displayFrameNum() {
	document.getElementById("FrameDisplayer").innerHTML = "Current Frame: " + frameNum;
}

function clearScreen() {
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
}

/*
function playCMV(timestamp) {
	resetFrame();
	while (true) {
		let dTime = timestamp - lastTime;
		lastTime = timestamp;
		if (dTime >= 10) {
			if (incrementFrameNumAndDisplay()) {
				break;
			}
		}
	}
}
*/

function convert437ToUTF(code) {
	let utfCode = code;
	if ((code >= 32 && code <= 126) || code == 0) {
		utfCode = code;
	}
	else {
		switch (code) { // This was tedious
			case 1: utfCode = 0x263A; break;
			case 2: utfCode = 0x263B; break;
			case 3: utfCode = 0x2665; break;
			case 4: utfCode = 0x2666; break;
			case 5: utfCode = 0x2663; break;
			case 6: utfCode = 0x2660; break;
			case 7: utfCode = 0x2022; break;
			case 8: utfCode = 0x25D8; break;
			case 9: utfCode = 0x25CB; break;
			case 10: utfCode = 0x25D9; break;
			case 11: utfCode = 0x2642; break;
			case 12: utfCode = 0x2640; break;
			case 13: utfCode = 0x266A; break;
			case 14: utfCode = 0x266B; break;
			case 15: utfCode = 0x263C; break;
			case 16: utfCode = 0x25BA; break;
			case 17: utfCode = 0x25C4; break;
			case 18: utfCode = 0x2195; break;
			case 19: utfCode = 0x203C; break;
			case 20: utfCode = 0x00B6; break;
			case 21: utfCode = 0x00A7; break;
			case 22: utfCode = 0x25AC; break;
			case 23: utfCode = 0x21A8; break;
			case 24: utfCode = 0x2191; break;
			case 25: utfCode = 0x2193; break;
			case 26: utfCode = 0x2192; break;
			case 27: utfCode = 0x2190; break;
			case 28: utfCode = 0x221F; break;
			case 29: utfCode = 0x2194; break;
			case 30: utfCode = 0x25B2; break;
			case 31: utfCode = 0x25BC; break;
			case 127: utfCode = 0x2302; break;
			case 128: utfCode = 0x00C7; break;
			case 129: utfCode = 0x00FC; break;
			case 130: utfCode = 0x00E9; break;
			case 131: utfCode = 0x00E2; break;
			case 132: utfCode = 0x00E4; break;
			case 133: utfCode = 0x00E0; break;
			case 134: utfCode = 0x00E5; break;
			case 135: utfCode = 0x00E7; break;
			case 136: utfCode = 0x00EA; break;
			case 137: utfCode = 0x00EB; break;
			case 138: utfCode = 0x00E8; break;
			case 139: utfCode = 0x00EF; break;
			case 140: utfCode = 0x00EE; break;
			case 141: utfCode = 0x00EC; break;
			case 142: utfCode = 0x00C4; break;
			case 143: utfCode = 0x00C5; break;
			case 144: utfCode = 0x00C9; break;
			case 145: utfCode = 0x00E6; break;
			case 146: utfCode = 0x00C6; break;
			case 147: utfCode = 0x00F4; break;
			case 148: utfCode = 0x00F6; break;
			case 149: utfCode = 0x00F2; break;
			case 150: utfCode = 0x00FB; break;
			case 151: utfCode = 0x00F9; break;
			case 152: utfCode = 0x00FF; break;
			case 153: utfCode = 0x00D6; break;
			case 154: utfCode = 0x00DC; break;
			case 155: utfCode = 0x00A2; break;
			case 156: utfCode = 0x00A3; break;
			case 157: utfCode = 0x00A5; break;
			case 158: utfCode = 0x20A7; break;
			case 159: utfCode = 0x0192; break;
			case 160: utfCode = 0x00E1; break;
			case 161: utfCode = 0x00ED; break;
			case 162: utfCode = 0x00F3; break;
			case 163: utfCode = 0x00FA; break;
			case 164: utfCode = 0x00F1; break;
			case 165: utfCode = 0x00D1; break;
			case 166: utfCode = 0x00AA; break;
			case 167: utfCode = 0x00BA; break;
			case 168: utfCode = 0x00BF; break;
			case 169: utfCode = 0x2310; break;
			case 170: utfCode = 0x00AC; break;
			case 171: utfCode = 0x00BD; break;
			case 172: utfCode = 0x00BC; break;
			case 173: utfCode = 0x00A1; break;
			case 174: utfCode = 0x00AB; break;
			case 175: utfCode = 0x00BB; break;
			case 176: utfCode = 0x2591; break;
			case 177: utfCode = 0x2592; break;
			case 178: utfCode = 0x2593; break;
			case 179: utfCode = 0x2502; break;
			case 180: utfCode = 0x2524; break;
			case 181: utfCode = 0x2561; break;
			case 182: utfCode = 0x2562; break;
			case 183: utfCode = 0x2556; break;
			case 184: utfCode = 0x2555; break;
			case 185: utfCode = 0x2563; break;
			case 186: utfCode = 0x2551; break;
			case 187: utfCode = 0x2557; break;
			case 188: utfCode = 0x255D; break;
			case 189: utfCode = 0x255C; break;
			case 190: utfCode = 0x255B; break;
			case 191: utfCode = 0x2510; break;
			case 192: utfCode = 0x2514; break;
			case 193: utfCode = 0x2534; break;
			case 194: utfCode = 0x252C; break;
			case 195: utfCode = 0x251C; break;
			case 196: utfCode = 0x2500; break;
			case 197: utfCode = 0x253C; break;
			case 198: utfCode = 0x255E; break;
			case 199: utfCode = 0x255F; break;
			case 200: utfCode = 0x255A; break;
			case 201: utfCode = 0x2554; break;
			case 202: utfCode = 0x2569; break;
			case 203: utfCode = 0x2566; break;
			case 204: utfCode = 0x2560; break;
			case 205: utfCode = 0x2550; break;
			case 206: utfCode = 0x255C; break;
			case 207: utfCode = 0x2567; break;
			case 208: utfCode = 0x2568; break;
			case 209: utfCode = 0x2564; break;
			case 210: utfCode = 0x2565; break;
			case 211: utfCode = 0x2559; break;
			case 212: utfCode = 0x2558; break;
			case 213: utfCode = 0x2552; break;
			case 214: utfCode = 0x2553; break;
			case 215: utfCode = 0x256B; break;
			case 216: utfCode = 0x256A; break;
			case 217: utfCode = 0x2518; break;
			case 218: utfCode = 0x250C; break;
			case 219: utfCode = 0x2588; break;
			case 220: utfCode = 0x2584; break;
			case 221: utfCode = 0x258C; break;
			case 222: utfCode = 0x2590; break;
			case 223: utfCode = 0x2580; break;
			case 224: utfCode = 0x03B1; break;
			case 225: utfCode = 0x00DF; break;
			case 226: utfCode = 0x0393; break;
			case 227: utfCode = 0x03C0; break;
			case 228: utfCode = 0x03A3; break;
			case 229: utfCode = 0x03C3; break;
			case 230: utfCode = 0x00B5; break;
			case 231: utfCode = 0x03C4; break;
			case 232: utfCode = 0x03A6; break;
			case 233: utfCode = 0x0398; break;
			case 234: utfCode = 0x03A9; break;
			case 235: utfCode = 0x03B4; break;
			case 236: utfCode = 0x221E; break;
			case 237: utfCode = 0x03C6; break;
			case 238: utfCode = 0x03B5; break;
			case 239: utfCode = 0x2229; break;
			case 240: utfCode = 0x2261; break;
			case 241: utfCode = 0x00B1; break;
			case 242: utfCode = 0x2265; break;
			case 243: utfCode = 0x2264; break;
			case 244: utfCode = 0x2320; break;
			case 245: utfCode = 0x2321; break;
			case 246: utfCode = 0x00F7; break;
			case 247: utfCode = 0x2248; break;
			case 248: utfCode = 0x00B0; break;
			case 249: utfCode = 0x2219; break;
			case 250: utfCode = 0x00B7; break;
			case 251: utfCode = 0x221A; break;
			case 252: utfCode = 0x207F; break;
			case 253: utfCode = 0x00B2; break;
			case 254: utfCode = 0x25A0; break;
			case 255: utfCode = 0x00A0; break;
		}
	}
	return utfCode;
}

