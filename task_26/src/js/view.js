function drawBg(width,height) {
	canvasBg.width = width;
	canvasBg.height = height;
	canvasAir.width = width;
	canvasAir.height = height; 	

	//draw backgruound
	ctxBg.save();
	ctxBg.fillStyle = "black";
	ctxBg.fillRect(0,0,width,height);
	ctxBg.restore();

	ctxBg.save();
	for(var i = 0 ; i < 100 ; i ++) {
		var rwidth = Math.random() * width;
		var rheight = Math.random() * height;
		ctxBg.fillStyle = "#e0c6ba";
		ctxBg.fillRect(rwidth, rheight, 2, 2);
	}
	ctxBg.restore();

	ctxBg.beginPath();
	ctxBg.arc(width / 2 ,height / 2 , 50 , 0, Math.PI * 2);
	ctxBg.fillStyle = "#310BBC";
	ctxBg.fill();
	ctxBg.closePath();
}


