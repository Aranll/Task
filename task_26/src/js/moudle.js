var AirboardObj = function (id) {
	this.id  = id;
	this.speed = Math.PI / 150;
	this.x;
	this.y;
	this.oil = 1000;
	this.use = 5;
	this.add = 2;
	this.alive = false;
	this.move = false;
	this.rotate = 0;
};

AirboardObj.prototype.drawAirboard = function (id) {
	ctxAir.save();
	ctxAir.translate(width / 2,height / 2);
    ctxAir.rotate(this.rotate);

	ctxAir.fillStyle = "#310BBC";

    ctxAir.fillRect(100 + id * 50 - 10, -20,20,40);

    ctxAir.rotate(90 * Math.PI / 180);
    ctxAir.fillStyle = "white";
    ctxAir.font = "16px Verdana";
    ctxAir.fillText(this.oil / 10,-15, -(100 + id * 50 - 5));

	ctxAir.restore();
};


AirboardObj.prototype.play = function(id) {
	clearInterval(stoploop);
	airboard[id].move = true;
	stoploop = setInterval(function () {
		ctxAir.clearRect(0,0,width,height);
		for (var m = 0; m < 4; m++) {
			if (airboard[m].alive == true) {
				airboard[m].drawAirboard(m);
				if (airboard[m].move == true) {
					airboard[m].oil = airboard[m].oil - airboard[m].use + airboard[m].add;
					airboard[m].rotate += airboard[m].speed;
				}

				if (airboard[m].move != true) {
					if (airboard[m].oil < 1000) {
						airboard[m].oil += airboard[m].add;
					};
				}

				if (airboard[m].oil < 0) {
					airboard[m].move = false;
					airboard[m].oil += airboard[m].add;
					if (airboard[i].oil > 100) {
						airboard[m].oil = 100;
					}
				}
			}
		};
	},50);
};


var PathwayObj = function (id) {
	this.id = id;
	this.empty = true;
};

PathwayObj.prototype.drawPath = function (id) {
	ctxBg.beginPath();
	ctxBg.arc(width / 2 ,height / 2 , 100 + id * 50 , 0, Math.PI * 2);
	ctxBg.strokeStyle = "white";
	ctxBg.stroke();
};
