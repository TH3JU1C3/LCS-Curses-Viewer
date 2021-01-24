document.getElementById("A").innerHTML = "Hello";

function readFile() {
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
			str += x.charCodeAt(i) + " ";
		}
		console.log(str);
		displayMovie(x);
	}
};

function displayMovie(data) {
	const picnum = data.charCodeAt(0);
	const dimx = data.charCodeAt(4);
	const dimy = data.charCodeAt(8);
	
	const canvas = document.getElementById("movieScreen");
	const canvasWidth = canvas.width;
	const canvasHeight = canvas.height;
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.font = "16px Consolas";
	ctx.fillStyle = "white";
	//ctx.fillText("Hi There",0,25);
	//ctx.fillText("Mr Gay",0,50);
	let colours = ["black","blue","green","cyan","red","magenta","yellow","white"];
	let bColour = colours[0];
	let fColour = colours[7];
	let dword = 3;
	let dword4 = dword*4;
	let charac = "";
	for (let x = 0; x < dimx; x++) {
		for (let y = 0; y < dimy; y++) {
				fColour = colours[data.charCodeAt(dword4+1)];
				bColour = colours[data.charCodeAt(dword4+2)];
				ctx.fillStyle = bColour;
				ctx.fillRect(x*8,y*16,(x+1)*8,(y+1)*16);
				ctx.fillStyle = fColour;
				charac = data.charAt(dword4);
				dword++;
				dword4 = dword*4;
				if (charac == "\0" || charac == " ") {
					continue;
				}
				ctx.fillText(charac,x*8,y*16);
				console.log(data.charCodeAt(dword4),data.charCodeAt(dword4 + 1),data.charCodeAt(dword4 + 2),data.charCodeAt(dword4 + 3));
				if (dword > 5000) {
					console.log("XXX");
				}
				//cCount = (cCount + 1) % colours.length;
		}
	}
	console.log("G");
}