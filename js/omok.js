var dolnum = 10;
var dolwidth = 650/dolnum;
var dolheight = 650/dolnum;
var boardwidth = dolwidth * dolnum;
var boardheight = dolheight * dolnum;
var DolX;
var DolY;
var boardarr = new Array(dolnum);
var selectplayer = 1;
var player = 1;
var initbut = true;
var gridcolor = "#302013";
var dolhistoryarr = new Array(dolnum * dolnum);
var dolindex = 0;


function startgame() {
	if (initbut == true) {
		document.getElementById('container').className += 'clicked';
		initbut = false;
	}

	var prevdiv = document.getElementById('wondiv');
	if (prevdiv.classList.contains('black')) {
		prevdiv.classList.remove('black');
	}
	if (prevdiv.classList.contains('draw')) {
		prevdiv.classList.remove('draw');
	}

	drawboard();
	clearhistory();
	cleararr();
	detect();
	changeplayersetting();
	displayturn();

	var startbtn = document.getElementById('startbutton');
	if (startbtn !== null) {
		startbtn.textContent = 'Reset';
		startbtn.id = 'resetgame';
	}
	document.getElementById('resetgame').onclick = 
	document.getElementById('resetclass').onclick = function() {
		var prevcontainer = document.getElementById('wonalertcontainer');
		if (prevcontainer.classList.contains('show')) {
			prevcontainer.classList.remove('show');
		}
		var elem = document.getElementById('canv');
		elem.remove();
		startgame();
	}

	var restartbtn = document.getElementById('restartbutton');
	restartbtn.onclick = function() {
		var elem = document.getElementById('canv');
		elem.remove();
		selectplayer = document.querySelector('input[name="color"]:checked').value;
		changedolsetting();
		startgame();
	}
}

function changeplayersetting() {
	if (selectplayer == 1) {
		player = 1;
	} else {
		player = 0;
	}
}

function changedolsetting() {
	dolnum = document.querySelector('input[name="size"]:checked').value;
	dolwidth = 650/dolnum;
	dolheight = 650/dolnum;
	boardwidth = dolwidth * dolnum;
	boardheight = dolheight * dolnum;
}

function displayturn() {
	var text = document.getElementById("turnspan");
	var turndiv = document.getElementById("turndiv");
	if (player == 1) {
		text.innerHTML = "black's turn!";
		if (turndiv.classList.contains('white')) {
			turndiv.classList.remove('white');
		}
	} else {
		text.innerHTML = "white's turn!";
		if (!(turndiv.classList.contains('white'))) {
			turndiv.classList.add('white');
		}	
	}
}

function drawboard() {
	var canv = document.createElement("canvas");
	canv.setAttribute("id","canv");
	canv.width = boardwidth;
	canv.height = boardheight;
	canv.onclick = putdol;
	document.getElementById("canvasdiv").appendChild(canv);
	// var ctx0 = canv.getContext("2d");
	// ctx0.fillStyle = "#ffc61a"; // i can change the color of the board here
	// ctx0.fillRect(0 + dolwidth/2,0 + dolheight/2,boardwidth - dolwidth, boardheight - dolheight);
	// ctx0.stroke();
	var ctx = canv.getContext("2d");
	ctx.strokeStyle = gridcolor;
	ctx.lineWidth = 4;
	ctx.strokeRect(0 + dolwidth/2,0 + dolheight/2,boardwidth - dolwidth, boardheight - dolheight);
	ctx.stroke();
	var ctxx = canv.getContext("2d");
	ctxx.lineWidth = 2;
	ctxx.beginPath();
	for (i = 1; i < dolnum; ++i) {
		ctxx.moveTo(dolwidth * i + dolwidth/2, dolheight/2);
		ctxx.lineTo(dolwidth * i + dolwidth/2, dolheight * dolnum - dolheight/2);
	}
	for (i = 1; i < dolnum; ++i) {
		ctxx.moveTo(dolwidth/2, dolheight * i + dolheight/2);
		ctxx.lineTo(dolwidth * dolnum - dolwidth/2, dolheight * i + dolheight/2);
	}
	ctxx.stroke();
}

function detect() {
	$(document).mousemove(function(event){ 
		var MouseX = Math.max(0, (event.pageX - $('#canv').offset().left)); 
		var MouseY = Math.max(0, (event.pageY - $('#canv').offset().top + 3));
		DolX = Math.min(Math.trunc(MouseX / dolwidth), dolnum - 1);
		DolY = Math.min(Math.trunc(MouseY / dolheight), dolnum - 1);
		$("#cord").text("DolX: " + DolX + "  DolY: " + DolY); 
	});
}

function cleararr() {
	boardarr = new Array(dolnum);
	for (i = 0; i < dolnum; ++i) {
		boardarr[i] = new Array(dolnum);
	}
	for (i = 0; i < dolnum; ++i) {
		for (j = 0; j <dolnum; ++j) {
			boardarr[i][j] = 2;
		}
	}
}

function clearhistory() {
	dolhistoryarr = new Array(dolnum * dolnum);
	var dolmax = dolnum * dolnum;
	for (i = 0; i < dolmax; ++i) {
		dolhistoryarr[i] = 2;
	}

	dolindex = 0;
}

function putdol() {
	if (boardarr[DolY][DolX] != 2) {
		var alertdiv = document.getElementById('dolalertcontainer');
		alertdiv.classList.add('show');
		window.setTimeout(addhide, 700);
		window.setTimeout(removecl, 1200);
		return;
	}
	var cx = DolX;
	var cy = DolY;
	var canvas = document.getElementById("canv");
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	if (player == 1) {
		ctx.fillStyle = 'black';
	} else {
		ctx.fillStyle = 'white';
	}
	ctx.arc(cx * dolwidth + dolwidth/2, cy * dolheight + dolheight/2, (dolwidth - 4)/2 ,0,2*Math.PI);
	ctx.stroke();
	ctx.fill();
	boardarr[cy][cx] = player;
	dolhistoryarr[dolindex] = cy * 100 + cx;
	alertdiv
	++dolindex;

	var message = document.getElementById("alertwhowon");
	if (haswon(player, cx, cy)) {
		if (player == 1) {
			message.innerHTML = "Black player has won!";
			document.getElementById('wondiv').classList.add('black');
		} else {
			message.innerHTML = "White player has won!";
		}
		document.getElementById('wonalertcontainer').classList.add('show');
		player = (player + 1) % 2;
		selectplayer = player;
	} else if (dolindex == dolnum * dolnum) {
		message.innerHTML = "Draw!!";
		document.getElementById('wondiv').classList.add('draw');
		document.getElementById('wonalertcontainer').classList.add('show');
	} else {
		player = (player + 1) % 2;
		displayturn();
	}
}

function addhide() {
	var alertdiv = document.getElementById('dolalertcontainer');
	alertdiv.classList.add('hide');
}

function removecl() {
	var alertdiv = document.getElementById('dolalertcontainer');
	alertdiv.classList.remove('show');
	alertdiv.classList.remove('hide');
}

function haswon(pl, x, y) {	
	var counter = 0;
	var maxsofar = 0;
	for (col = x - 4; col <= x + 4; ++col){
		if (col < 0 || col > dolnum - 1) {
			continue;
		}
		if (boardarr[y][col] == pl) {
			++counter;
		} else {
			counter = 0;
		}
		if (counter >= 5) {
			return true;
		}
	}

	counter = 0;

	for (row = y - 4; row <= y + 4; ++row) {
		if (row < 0 || row > dolnum - 1) {
			continue;
		}
		if (boardarr[row][x] == pl) {
			++counter;
		} else {
			counter = 0;
		}
		if (counter >= 5) {
			return true;
		}
	}

	counter = 0;

	for (j = -4; j <= 4; ++j) {
		var col = x + j;
		var row = y - j;
		if (row < 0 || col < 0 || row > dolnum - 1 || col > dolnum - 1) {
			continue;
		}
		if (boardarr[row][col] == pl) {
			++counter;
		} else {
			counter = 0;
		}
		if (counter >= 5) {
			return true;
		}
	}

	counter = 0;

	for (i = -4; i <= 4; ++i) {
		var col = x - i;
		var row = y - i;
		if (row < 0 || col < 0 || row > dolnum - 1 || col > dolnum - 1) {
			continue;
		}
		if (boardarr[row][col] == pl) {
			++counter;
		} else {
			counter = 0;
		}
		if (counter >= 5) {
			return true;
		}
	}

	return false;
}


function aboutbuttonsetting() {
	document.getElementById('aboutalertcontainer').classList.add('show');
}

function closebutton() {
	document.getElementById('aboutalertcontainer').classList.remove('show');
}

function returntoboard() {
	var container = document.getElementById('wonalertcontainer');
	var board = document.getElementById('canv');
	var wondiv = document.getElementById('wondiv');
	container.classList.remove('show');

	if (wondiv.classList.contains('black')) {
		wondiv.classList.remove('black');
	}
	if (wondiv.classList.contains('draw')) {
		wondiv.classList.remove('draw');
	}

}

function undodol() {
	if (dolindex == 0) return;

	var canvas = document.getElementById('canv');
	var lastindex = dolindex - 1;
	var lastpos = dolhistoryarr[lastindex];
	var lastX = lastpos % 100;
	var lastY = (lastpos - lastX) / 100;

	boardarr[lastY][lastX] = 2;
	player = (player + 1) % 2;
	--dolindex;

	var ctx = canvas.getContext('2d'); // clear square
	ctx.clearRect(lastX * dolwidth, lastY * dolheight, dolwidth, dolheight);

	ctx.lineWidth = (lastX == 0 || lastX == dolnum - 1) ? 4 : 2; //vertical drawing
	ctx.beginPath();
	var startpointX = lastY * dolheight;
	var endpointX = (1 + lastY) * dolheight;
	if (lastY == 0) startpointX += dolheight/2;
	if (lastY == dolnum - 1) endpointX -= dolheight/2;
	ctx.moveTo(lastX * dolwidth + dolwidth/2, startpointX);
	ctx.lineTo(lastX * dolwidth + dolwidth/2, endpointX);
	ctx.stroke();

	ctx.lineWidth = (lastY == 0 || lastY == dolnum - 1) ? 4 : 2; // horizontal drawing
	ctx.beginPath();
	var startpointY = lastX * dolwidth;
	var endpointY = (1 + lastX) * dolwidth;
	if (lastX == 0) startpointY += dolwidth/2;
	if (lastX == dolnum - 1) endpointY -= dolwidth/2;
	ctx.moveTo(startpointY, lastY * dolheight + dolheight/2);
	ctx.lineTo(endpointY, lastY * dolheight + dolheight/2);
	ctx.stroke();

	displayturn();
}