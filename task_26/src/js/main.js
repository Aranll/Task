var canvasBg,canvasAir;
var ctxBg,ctxAir;

var width;
var height;

var pathway = [];
var contral = [];
var airboard = [];

window.onload = init();

var stoploop;

var judegment = [0,0,0,1,1,1,1,1,1,1];
var massage;


function init() {
	massage = document.querySelector("#Console");	
	width = window.innerWidth;
	height = window.innerHeight;
	
	canvasBg = document.querySelector("#canvasBg");
	ctxBg = canvasBg.getContext("2d");
	canvasAir = document.querySelector("#canvasAir");
	ctxAir = canvasAir.getContext("2d");

	drawBg(width,height);

	for (var i = 0; i < 4; i++) {
			airboard[i] = new AirboardObj(i);
			contral[i] = document.querySelector("#airboard" + i);
			pathway[i] = new PathwayObj(i);
			pathway[i].drawPath(i);
	}

}

for (var i = 0; i < 4; i ++) {
	(function(i){
		contral[i].addEventListener("click",function(e) {
			if(e.target.id == "create" + i){
				var msg = parseInt(Math.random() * 10);
				setTimeout(function() {
					if (pathway[i].empty == true) {
						if (judegment[msg] == 1 && airboard[i].alive == false) {
							airboard[i] = new AirboardObj(i);
							airboard[i].alive = true;
							if (airboard[i].alive == true) {
								airboard[i].drawAirboard(i);
							}
							massage.innerHTML += "<li>传输成功</li>";
						} else if (judegment[msg] == 0) {
							massage.innerHTML += "<li class = \"fail\">传输失败</li>";
						}
						pathway[i].empty = false;
					}
				},1000);
			}

			if(e.target.id == "start" + i){
				var msg = parseInt(Math.random() * 10);
				setTimeout(function() {
					if (judegment[msg] == 1 && airboard[i].alive == true) {
						airboard[i].play(i);
						massage.innerHTML += "<li>传输成功</li>";
					} else {
						massage.innerHTML += "<li class = \"fail\">传输失败</li>";
					}
				},1000);
			}

			if(e.target.id == "stop" + i){
				var msg = parseInt(Math.random() * 10);
				setTimeout(function() {
					if (judegment[msg] == 1 && airboard[i].alive == true) {
						airboard[i].move = false;
						massage.innerHTML += "<li>传输成功</li>";
					} else {
						massage.innerHTML += "<li class = \"fail\">传输失败</li>";
					}
				},1000);		
			}

			if(e.target.id == "distory" + i){
				var msg = parseInt(Math.random() * 10);
				setTimeout(function() {
					pathway[i].empty = true;
					if (judegment[msg] == 1 && airboard[i].alive == true) {
						airboard[i].alive = false;
						ctxAir.clearRect(0,0,width,height);
						massage.innerHTML += "<li>传输成功</li>";
					} else {
						massage.innerHTML += "<li class = \"fail\">传输失败</li>";
					}
				},1000);
			}
		})
	})(i);
}
