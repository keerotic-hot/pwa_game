//(function(){
	var STATE = {
		TITLE:0,
		PLAYING:1,
		PAUSE:2,
		WIN:3,
		LOSE:4,
	};

	var container;
	var renderer;
	var scene;
	var light,light2;
	var camera;
	var controls;

	var toRad = Math.PI/180;
	var toDeg = 180/Math.PI;

	var touches = [];
	
	var BULLET_SPEED = 4;
	var MAX_SPEED = 3;
	var speed = 0;
	
	var enemies = [];
	var items = [];
	var bullets = [];
	
	var level = 1;
	var score = 0;

	var DEFAULT_MAX_HP = 100;
	var MAX_HP = DEFAULT_MAX_HP;
	var hp = MAX_HP;

	var state = STATE.TITLE;

	
	var info = document.getElementById('info');
	var scoreBoard = document.getElementById('scoreboard');
	var hpBar = document.getElementById('hp-bar');
	var hpIndcator = document.getElementById('hp');

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

		generateLevel(2,5);
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

		light2 = new THREE.DirectionalLight( 0xcc7700 );
		light2.position.set( 0, -200, -200 ).normalize();
		scene.add(light2);
	}

	function generateLevel(numEnenies,numItems){

		for(i = 0; i < numEnenies; i++){
			enemies.push(new Enemy());
		}

		for(i = 0; i < numItems; i++){
			items.push(new Item());
		}
	}

	function resetGame() {
		level = 1;
		MAX_HP = DEFAULT_MAX_HP;
		hp = MAX_HP;
		score = 0;
		camera.position.set(0,0,0);
		generateLevel(2,5);

		scoreBoard.innerHTML = 'Score : '+score;
		hpIndcator.style.width = (hp/MAX_HP*100)+'%';
	}

	function playGame(){
		state = STATE.PAUSE;
		gameTitle.classList.add('hide');

		levelCutScene.innerHTML = '<h1>Level '+level+' Start!!</h1>';
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

	function nextLevel(){
		levelWin.classList.add('hide');		
		level++;
		generateLevel(2,5);
		playGame();
	}

	function playAgain(){
		resetGame();
		playGame();
		levelLose.classList.add('hide');	
	}

	function mainMenu(){
		resetGame();
		state = STATE.TITLE;
		levelLose.classList.add('hide');	
		gameTitle.classList.remove('hide');	
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
			case STATE.WIN:
				break;
			case STATE.LOSE:
				break;
		}
	}

	function gameLoop(){

		walkIf(touches.length>0);
		
		if(touches.length>1){ fire(); }

		for(var i in enemies){
			enemies[i].update();

			if(enemies[i].hitted()){
				if(hp > 0){
					hp--;
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
		hpIndcator.style.width = (hp/MAX_HP*100)+'%';

		info.innerHTML = 
			(camera.rotation.x*toDeg).toFixed(2)+','+
			(camera.rotation.y*toDeg).toFixed(2)+','+
			(camera.rotation.z*toDeg).toFixed(2);

		if(camera.rotation.x*toDeg<-80){
			pauseGame();
		}

		if(items.length <= 0){
			state = STATE.WIN;
			levelWin.classList.remove('hide');
			//levelWin.innerHTML = '<h1>Level '+level+' Clear!!</h1>';
		}

		if(hp <= 0){
			state = STATE.LOSE;
			levelLose.classList.remove('hide');
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
		var geo = new THREE.CylinderGeometry( 10, 10, 2, 16, 1 );
		var mat = new THREE.MeshPhongMaterial({ 
			color: 0xffd700, 
			shading: THREE.SmoothShading, 
			overdraw: 0.5, 
			shininess: 0 
		});
		var mesh = new THREE.Mesh(geo,mat);

		scene.add(mesh);
		var x = Math.random()*1000-500;
		var y = 0;//Math.random()*100;
		var z = Math.random()*1000-500;
		mesh.position.set(x,y,z);
		mesh.rotateX(90*toRad);

		_this.update = function(){
			mesh.rotateZ(5*toRad);
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