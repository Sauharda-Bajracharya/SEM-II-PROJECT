import"./style.css";import*as THREE from"three";import{CSS2DObject}from"three/examples/jsm/renderers/CSS2DRenderer";import{OrbitControls}from"three/examples/jsm/controls/OrbitControls";import{DRACOLoader}from"three/examples/jsm/loaders/DRACOLoader";import{GLTFLoader}from"three/examples/jsm/loaders/GLTFLoader";const canvas=document.querySelector("canvas.webgl"),cursorCircle=document.querySelector(".cursor-circle"),navbarDetailsLink=document.querySelector(".navbar-right li:first-child a"),detailsDiv=document.querySelector(".details");navbarDetailsLink.addEventListener("click",(()=>{detailsDiv.classList.toggle("hidden")}));const sizes={width:window.innerWidth,height:window.innerHeight},scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(10,sizes.width/sizes.height);scene.add(camera);const dracoLoader=new DRACOLoader;dracoLoader.setDecoderPath("draco/");const gltfLoader=new GLTFLoader;gltfLoader.setDRACOLoader(dracoLoader);const spotLight=new THREE.AmbientLight(16777215);spotLight.position.set(1,1,0),scene.add(spotLight);const newSpotLight=new THREE.DirectionalLight(16777215);newSpotLight.position.set(0,1,0),scene.add(newSpotLight);const groundGeometry=new THREE.PlaneGeometry(500,500,1,1),groundMaterial=new THREE.MeshStandardMaterial({color:5064789,roughness:.1,metalness:.9}),ground=new THREE.Mesh(groundGeometry,groundMaterial);let car;ground.rotation.x=-.5*Math.PI,scene.add(ground),gltfLoader.load("car3.glb",(e=>{car=e.scene,scene.add(car);const t=new THREE.Vector3;car.getWorldPosition(t);const r=new THREE.Vector3(1.1917919260198613,.7448141407084368,1.7563837567213605);camera.position.copy(t).add(r),car.position.x=.19}));const cursor={x:0,y:0};window.addEventListener("mousemove",(e=>{const t=e.clientX,r=e.clientY;cursorCircle.style.left=`${t}px`,cursorCircle.style.top=`${r}px`}));const renderer=new THREE.WebGLRenderer({canvas});renderer.setSize(sizes.width,sizes.height);const controls=new OrbitControls(camera,canvas);function onClick(e){const t=new THREE.Vector2;t.x=e.clientX/window.innerWidth*2-1,t.y=-e.clientY/window.innerHeight*2+1,(new THREE.Raycaster).setFromCamera(t,camera),console.log("Camera Position:",camera.position)}window.addEventListener("dblclick",(()=>{document.fullscreenElement?document.exitFullscreen():canvas.requestFullscreen()})),window.addEventListener("resize",(()=>{sizes.width=window.innerWidth,sizes.height=window.innerHeight,camera.aspect=sizes.width/sizes.height,camera.updateProjectionMatrix(),renderer.setSize(sizes.width,sizes.height),renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))})),window.addEventListener("click",onClick);const starPositions=[],numStars=1e3;for(let e=0;e<1e3;e++){const e=2e3*Math.random()-1e3,t=2e3*Math.random()-1e3,r=2e3*Math.random()-1e3;starPositions.push({x:e,y:t,z:r})}const starSpheres=[],starMaterial=new THREE.MeshBasicMaterial({color:16777215});for(const e of starPositions){const t=new THREE.SphereGeometry(1,16,16),r=new THREE.Mesh(t,starMaterial);r.position.set(e.x,e.y,e.z),starSpheres.push(r),scene.add(r)}starSpheres.forEach((e=>{e.renderOrder=-1})),window.addEventListener("keydown",(e=>{if("r"===e.key||"R"===e.key){const e=new THREE.Vector3(1.1917919260198613,.7448141407084368,1.7563837567213605),t=new THREE.Vector3(0,0,0);camera.position.copy(e),camera.lookAt(t)}}));const animate=()=>{renderer.render(scene,camera),controls.update(),requestAnimationFrame(animate)};animate();