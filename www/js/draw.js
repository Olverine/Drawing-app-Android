var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var pos;

var sizeRange = document.getElementById("sizeRange");
var color = document.getElementById("color");

var drawing = false;

var scalefactor = 1;

function setScaleFactor(){
	scalefactor = c.height / window.innerHeight;
	console.log(scalefactor);
}

c.onmousedown = function(){
	setToolbarExpanded(false);
	drawing = true
	draw(pos, pos, document.getElementById("toolSelect").value, color.value, sizeRange.value, true);
}

document.onmouseup = function(){
	drawing = false;
}

document.onmousemove = function(evt){
	if(sizeRange.value > 40){
		sizeRange.min = 1;
		sizeRange.max = 40;
	}
	var lastPos = pos;
	pos = getMousePos(c, evt);
	if(drawing){
		draw(lastPos, pos, document.getElementById("toolSelect").value, color.value, sizeRange.value, true);
	}else{
		ctx.moveTo(pos.x,pos.y);
	}
}

function getMousePos(canv, evt) {
    var rect = canv.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * scalefactor,
      y: (evt.clientY - rect.top) * scalefactor
    };
}

function getTouchPos(canv, evt) {
	setScaleFactor();
    var rect = canv.getBoundingClientRect();
    var touch = evt.touches[0];
    return {
      x: (touch.clientX - rect.left) * scalefactor,
      y: (touch.clientY - rect.top) * scalefactor
    };
}

c.ontouchstart = function(evt){
	setToolbarExpanded(false);
	pos = getTouchPos(c, evt);
	draw(pos, pos, document.getElementById("toolSelect").value, color.value, sizeRange.value, true);
}

c.ontouchmove = function(evt){
	var lastPos = pos;
	pos = getTouchPos(c, evt);
	draw(lastPos, pos, document.getElementById("toolSelect").value, color.value, sizeRange.value, true);
};

function draw(pos1, pos2, tool, color, width, emit){
	width *= 2
	switch(tool){
		case "pen":
			ctx.beginPath();
			ctx.moveTo(pos1.x, pos1.y);
			ctx.lineTo(pos2.x, pos2.y);
			ctx.lineWidth = width;
			ctx.strokeStyle = color;
			ctx.lineCap="round";
			ctx.stroke();
		break;

		case "eraser":
			var p1 = [pos1.x, pos1.y];
			var p2 = [pos2.x, pos2.y];
			var points = bresenham(p1, p2);
			for(var i = 0; i < points.length; i++)
				ctx.clearRect(points[i][0] - width, points[i][1] - width, width * 2, width * 2);
		break;
	}

	if(emit)
		socket.emit("draw", pos1.x / 2, pos1.y / 2, pos2.x / 2, pos2.y / 2, color, width / 2, tool);
}

function toggleGrid(){
	if(gridCheckbox.checked){
		c.className = "grid";
	}else{
		c.className = "";
	}
}
