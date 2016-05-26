(function(){
	var w = 800, h = 400;
	var requestId;

	var pt_num = 12;
	var pt_num_fix = 10;
	var pt_x = [];
	var pt_y = [];
	var pt_vx = [];
	var pt_vy = [];

	var canvas = document.getElementById('canvas');
	canvas.addEventListener("click", onClick, false);
	canvas.addEventListener('mousemove', onMove, false);
	var ctx = canvas.getContext('2d');
	
	init();
	requestId = window.requestAnimationFrame(renderPlay); 

	function initPts(){
		for(var i = 0; i < pt_num; i++){
			pt_x[i] = i*140;
			pt_y[i] = (i%4)*140;
			pt_x[i] %= 400;
			pt_y[i] %= 400;
			pt_vx[i] = 1+Math.floor(Math.random()*3);
			pt_vy[i] = 1+Math.floor(Math.random()*3);
		}
	}

	function modPosPts(){
		for(var i = 1; i < pt_num_fix; i++){
			pt_x[i] += pt_vx[i];
			pt_y[i] += pt_vy[i];
			pt_x[i] %= 400;
			pt_y[i] %= 400;
		}
	}

	function init(){
		initPts();
	}

	function bfs(){
		var d = [0,1,0,-1,0];
		var dist = [];
		var qr = [];
		var qc = [];
		for(var i = 0; i < 400; i++){
			dist[i] = [];
			for(var j = 0; j < 400; j++){
				dist[i][j] = -1;
				if(i==0 || i==399 || j==0 || j==399)
					dist[i][j] = 0;
			}
		}
		for(var i = 0; i < pt_num; i++){
			var row = pt_x[i];
			var col = pt_y[i];
			dist[row][col] = 0;
			qr[i] = row;
			qc[i] = col;
			ctx.fillStyle = '#fff';
			ctx.fillRect(row+400,col,1,1);
		}
		var qi = 0;
		var qe = pt_num;
		//var distmax = 0;
		while(qi<qe){
			var r = qr[qi];
			var c = qc[qi];
			qi++;
			for(var i = 0; i < 4; i++){
				var nr = r + d[i];
				var nc = c + d[i+1];
				if(-1<nr && nr<400 && -1<nc && nc<400 && dist[nr][nc] == -1){
					dist[nr][nc] = dist[r][c] + 1;
					//distmax = Math.max(distmax,dist[nr][nc]);
					//var color = 65536 - dist[nr][nc]*dist[nr][nc];
					//color = Math.floor(color/256);
					var color = 65536 - dist[nr][nc]*256;
					color = Math.floor(color/256);
					if(color<0)color = 0;
					color = color.toString(16);
					if(color.length==1)color = '0'+color;
					ctx.fillStyle = '#'+color+color+color;
					ctx.fillRect(nr+400,nc,1,1);
					qr[qe] = nr;
					qc[qe] = nc;
					qe++;
				}
			}
		}
		//console.log(distmax);
	}

	function renderPlay(){
		ctx.fillStyle = '#aaa';
		ctx.fillRect(0,0,w,h);

		ctx.fillStyle = '#000';
		for(var i = 0; i < pt_num; i++){
			ctx.fillRect(pt_x[i],pt_y[i],5,5);
		}
		bfs();

		modPosPts();
		
		requestId = window.requestAnimationFrame(renderPlay); 
	}

	function onClick(e){
		var rect = e.target.getBoundingClientRect();
		var x =  Math.round(e.clientX - rect.left);
		var y =  Math.round(e.clientY - rect.top);
		//console.log("click "+x+" "+y);
	}

	function onMove(e){
		var rect = e.target.getBoundingClientRect();
		var x =  Math.round(e.clientX - rect.left);
		var y =  Math.round(e.clientY - rect.top);
		if(0<x && x<400 && 0<y && y<400){
			pt_x[0] = x;
			pt_y[0] = y;
		}
		//console.log(x+" "+y);
	}
	
})();