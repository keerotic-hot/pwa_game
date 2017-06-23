(function(){
	var container;
	var renderer;
	var scene;
	var camera;
	var controls;

	window.addEventListener('load', function() {
		init();
		loop();
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
		var geo = new THREE.PlaneGeometry( 2000, 2000, 20,20 );
		var mat = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
		var object = new THREE.Mesh(geo,mat);
		object.rotation.set(90*Math.PI/180,0,0);
		object.position.set(0,-50,0);
		scene.add( object );
	}

	function loop(){
		requestAnimationFrame(loop);
		
		//camera.translateZ(-1);
		var dir = camera.getWorldDirection();
		dir.y = 0;
		camera.position.add(dir.multiplyScalar(1));

		controls.update();
		renderer.render(scene,camera);
	}


	/*function FlyingObject(){
		var _this = this;
		var geo = new THREE.BoxGeometry(20,20,20,1,1,1);
		var mat = new THREE.MeshBasicMaterial({color:0xff0000});
		var mesh = new THREE.Mesh(geo,mat);

		scene.add(mesh);
		var x = Math.random()*1000-500;
		var y = Math.random()*100;
		var z = Math.random()*1000-500;
		mesh.position.set(x,y,z);
	}

	function createFlyingObject(){
		var fo = new FlyingObject();
	}*/
	
})();