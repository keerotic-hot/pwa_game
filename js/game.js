//(function(){
	var STATE = {
		TITLE:0,
		PLAYING:1,
		PAUSE:2,
	};

	var container;
	var renderer;
	var scene;
	var light;
	var camera;
	var controls;

	var toRad = Math.PI/180;
	var toDeg = 180/Math.PI;

	var touches = [];
	
	var speed = 0;
	var MAX_SPEED = 3;
	var BULLET_SPEED = 4;

	var enemies = [];
	var items = [];
	var bullets = [];
	
	var level = 1;
	var score = 0;

	var state = STATE.TITLE;

	
	var info = document.getElementById('info');
	var scoreBoard = document.getElementById('scoreboard');
	var gameTitle = document.getElementById('game-title');
	var levelCutScene = document.getElementById('level-cutscene');
	var levelWin = document.getElementById('level-win');
	var levelLose = document.getElementById('level-lose');
	var gamePause = document.getElementById('game-pause');

	window.addEventListener('load', function() {
		init();
		loop();

		gameTitle.classList.remove('hide');
	});

	function init(){
		container = document.createElement('div');
		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,4000);
		camera.position.set(0,0,0);
		controls = new THREE.DeviceOrientationControls(camera);

		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		container.appendChild(renderer.domElement);

		window.addEventListener('resize',onWindowResize);
		onWindowResize();

		createSkybox();
		createPlane();
		createLight();

		initController();

		for(i = 0; i < 10; i++){
			enemies.push(new Enemy());
		}

		for(i = 0; i < 20; i++){
			items.push(new Item());
		}
	}

	function onWindowResize(){
		renderer.setSize(window.innerWidth,window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();	
	}

	function createSkybox(){
		var geo = new THREE.SphereGeometry(2000,16,8);
		geo.scale(-1,1,1);

		var mat = new THREE.MeshBasicMaterial({
			map:new THREE.TextureLoader().load('img/skybox.jpg')
		});

		var skybox = new THREE.Mesh(geo,mat);
		scene.add(skybox);
	}

	function createPlane(){
		var geo = new THREE.PlaneGeometry( 2000, 2000, 40,40 );
		var mat = new THREE.MeshBasicMaterial( { 
			color: 0xff0000, 
			wireframe: true, 
			transparent: true, 
			opacity: 0.5, side: 
			THREE.DoubleSide 
		});
		var object = new THREE.Mesh(geo,mat);
		object.rotation.set(90*toRad,0,0);
		object.position.set(0,-20,0);
		scene.add( object );
	}

	function createLight(){

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 0, 100, 100 ).normalize();
		scene.add(light);
	}

	function playGame(){
		state = STATE.PAUSE;
		gameTitle.classList.add('hide');

		levelCutScene.innerHTML = '<h1>Level : '+level+'</h1>';
		levelCutScene.classList.remove('hide');
		setTimeout(function(){
			levelCutScene.classList.add('hide');
			state = STATE.PLAYING;
		},1500);
	}

	function pauseGame(){
		state = STATE.PAUSE;
		gamePause.classList.remove('hide');
	}

	function continueGame(){
		state = STATE.PLAYING;
		gamePause.classList.add('hide');		
	}

	function loop(){
		requestAnimationFrame(loop);
		
		switch(state){
			case STATE.TITLE:
				break;
			case STATE.PLAYING:
				gameLoop();
				break;
			case STATE.PAUSE:
				pauseLoop();
				break;
		}
	}

	function gameLoop(){

		walkIf(touches.length>0);
		
		if(touches.length>1){ fire(); }

		for(var i in enemies){
			enemies[i].update();

			if(enemies[i].hitted()){
				if(score > 0){
					score--;
				}
			}
		}

		for(var i in items){
			items[i].update();

			if(items[i].hitted()){
				hitItems = items.splice(i,1);
				hitItems[0].remove();
				score=score+10;
			}
		}
		for(var i in bullets){
			bullets[i].update();
		}

		controls.update();
		renderer.render(scene,camera);

		scoreBoard.innerHTML = 'Score : '+score;
		info.innerHTML = 
			(camera.rotation.x*toDeg).toFixed(2)+','+
			(camera.rotation.y*toDeg).toFixed(2)+','+
			(camera.rotation.z*toDeg).toFixed(2);

		if(camera.rotation.x*toDeg<-80){
			pauseGame();
		}
	}

	function pauseLoop(){
		controls.update();
		renderer.render(scene,camera);
	}

	function walkIf(isWalking){
		if(isWalking){
			if(speed < MAX_SPEED){
				speed++;
			}
		}
		else {
			if(speed > 0){
				speed--;
			}
		}

		//camera.translateZ(-1);
		var dir = camera.getWorldDirection();
		dir.y = 0;
		camera.position.add(dir.multiplyScalar(speed));
	}

	var canFire = true;
	function fire(){
		if(canFire){
			bullets.push(new Bullet());
			canFire = false;
			setTimeout(function(){canFire = true},500);
		}
	}

	function Item(){
		var _this = this;
		var geo = new THREE.BoxGeometry(15,15,15,1,1,1);
		var mat = new THREE.MeshPhongMaterial({ 
			color: 0x00ffff, 
			shading: THREE.FlatShading, 
			overdraw: 0.5, 
			shininess: 0 
		});
		var mesh = new THREE.Mesh(geo,mat);

		scene.add(mesh);
		var x = Math.random()*1000-500;
		var y = 0;//Math.random()*100;
		var z = Math.random()*1000-500;
		mesh.position.set(x,y,z);

		_this.update = function(){
			mesh.rotateX(2*toRad);
			mesh.rotateY(1*toRad);
		}

		_this.hitted = function(){
			return mesh.position.distanceTo(camera.position)<20;
		}

		_this.remove = function(){
			scene.remove(mesh);
		}
	}

	function Enemy(){
		var _this = this;
		var geo = new THREE.BoxGeometry(30,30,30,1,1,1);
		var mat = new THREE.MeshPhongMaterial({ 
			color: 0xff0000, 
			shading: THREE.FlatShading, 
			overdraw: 0.5, 
			shininess: 0 
		});
		var mesh = new THREE.Mesh(geo,mat);

		scene.add(mesh);
		var x = Math.random()*1000-500;
		var y = 0;//Math.random()*100;
		var z = Math.random()*1000-500;
		mesh.position.set(x,y,z);

		_this.update = function(){
			mesh.rotateX(2*toRad);
			mesh.rotateY(4*toRad);
		}

		_this.hitted = function(){
			return mesh.position.distanceTo(camera.position)<20;
		}

		_this.remove = function(){
			scene.remove(mesh);
		}
	}

	function Bullet(){
		var _this = this;
		var geo = new THREE.SphereGeometry(1,8,8);
		var mat = new THREE.MeshPhongMaterial({ 
			color: 0xffff00, 
			shading: THREE.FlatShading, 
			overdraw: 0.5, 
			shininess: 0 
		});
		var mesh = new THREE.Mesh(geo,mat);

		var dir = camera.getWorldDirection();

		scene.add(mesh);

		mesh.position.set(camera.position.x,camera.position.y,camera.position.z);
		mesh.rotation.set(camera.rotation.x,camera.rotation.y,camera.rotation.z);
		
		_this.update = function(){
			mesh.position.add(dir.multiplyScalar(BULLET_SPEED));
		}
	}

	function initController(){
		info.innerHTML = 'init controller';

		window.addEventListener('touchstart',function(event){
			touches = event.touches;
			info.innerHTML = 'touchstart : '+touches.length;
		});

		window.addEventListener('touchmove',function(event){
			touches = event.touches;
			info.innerHTML = 'touchemove : '+touches.length;
		});

		window.addEventListener('touchend',function(event){
			touches = event.touches;
			info.innerHTML = 'touchend : '+touches.length;
		});
	}
	
//})();