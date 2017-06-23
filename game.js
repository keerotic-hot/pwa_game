(function(){
	var container;
	var renderer;
	var scene;
	var camera;
	var controls;

	window.addEventListener('load', function() {
		container = document.createElement('div');
		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1100);
		controls = new THREE.DeviceOrientationControls(camera);

		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth,window.innerHeight);

		container.appendChild(renderer.domElement);

		createSkybox();

		loop();
	});

	function createSkybox(){
		var geo = new THREE.SphereGeometry(500,16,8);
		geo.scale(-1,1,1);

		var mat = new THREE.MeshBasicMaterial({
			map:new THREE.TextureLoader().load('img/skybox.jpg')
		});

		var skybox = new THREE.Mesh(geo,mat);
		scene.add(skybox);
	}

	function loop(){
		requestAnimationFrame(loop);
		controls.update();
		renderer.render(scene,camera);
	}
})();