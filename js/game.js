(function(){
	var container;
	var renderer;
	var scene;
	var camera;
	var controls;

	window.addEventListener('load', function() {
		container = document.createElement('div');
		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(100,window.innerWidth/window.innerHeight,1,2000);
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

		loop();
	});

	function onWindowResize(){
		renderer.setSize(window.innerWidth,window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();	
	}

	function createSkybox(){
		var geo = new THREE.SphereGeometry(1000,16,8);
		geo.scale(-1,1,1);

		var mat = new THREE.MeshBasicMaterial({
			map:new THREE.TextureLoader().load('img/skybox.jpg')
		});

		var skybox = new THREE.Mesh(geo,mat);
		scene.add(skybox);
	}


	function createPlane(){
		var geo = new THREE.PlaneGeometry( 1000, 1000, 20,20 );
		var mat = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
		var object = new THREE.Mesh(geo,mat);
		object.rotation.set(90*Math.PI/180,0,0);
		object.position.set(0,-50,0);
		scene.add( object );
	}

	function loop(){
		requestAnimationFrame(loop);
		controls.update();
		renderer.render(scene,camera);
	}
})();