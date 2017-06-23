(function(){
	var container;
	var renderer;
	var scene;
	var camera;
	window.addEventListener('load', function() {
		
		container = document.createElement('div');
		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000);

		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth,window.innerHeight);

		container.appendChild(renderer.domElement);

		renderer.render(scene,camera);
	});
})();