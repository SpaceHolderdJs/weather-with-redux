import * as THREE from "three";
// import VDBLoader from "../node_modules/three/examples/jsm/loaders/VOXLoader";

import {
  GodRaysEffect,
  EffectComposer,
  RenderPass,
  EffectPass,
} from "postprocessing";

const listeners = {};

const initScene = (config) => {
  document.querySelector("canvas") &&
    document.body.removeChild(document.querySelector("canvas"));

  //constants
  const { time, weatherType } = config;
  console.log("!!!", weatherType);
  const hours = time.getHours();
  console.log(hours);

  const sunPosition = {
    x:
      hours >= 0 && hours < 6
        ? 230 - (50 + hours * 7)
        : hours > 7 && hours < 15
        ? hours * 10
        : hours * 6,
    y:
      hours >= 0 && hours <= 6
        ? 100 - (50 + hours * 7)
        : hours > 7 && hours < 15
        ? hours * 10
        : hours * 6,
    z:
      hours >= 0 && hours < 6
        ? -230 + hours * 10
        : hours > 7 && hours < 15
        ? hours * -15
        : hours * -10,
  };

  const sunColor =
    (hours > 6 && hours < 10) || (hours > 18 && hours < 20)
      ? "orange"
      : hours > 22 || (hours >= 0 && hours < 6)
      ? "white"
      : "0xffccaa";

  const rendererColor =
    weatherType && (weatherType === "fog" || weatherType === "smoke")
      ? "ligthgrey"
      : (hours > 5 && hours < 10) || (hours > 18 && hours < 20)
      ? "orangered"
      : hours > 22 || (hours >= 0 && hours < 6)
      ? "darkblue"
      : "lightblue";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: false,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(50, 50, 199, 199);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("rgb(10, 70, 50)"),
    colorWrite: true,
  });

  //SUN

  const sunGeo = new THREE.CircleGeometry(10, 10, 300);
  const sunMat = new THREE.MeshBasicMaterial({ color: sunColor });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
  sun.scale.setX(1.1);
  scene.add(sun);

  console.log(sun);

  const godraysEffect = new GodRaysEffect(camera, sun, {
    resolutionScale: 1,
    density: 0.8,
    decay: 0.95,
    weight: 0.2,
    samples: 100,
  });

  //SUNLIGTH

  const sunLight = new THREE.DirectionalLight(sunColor, 1.5);
  sunLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
  scene.add(sunLight);

  const renderPass = new RenderPass(scene, camera);
  const effectPass = new EffectPass(camera, godraysEffect);
  effectPass.renderToScreen = true;
  const composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectPass);

  console.log(geometry);

  scene.background = new THREE.Color(new THREE.Color(rendererColor));
  scene.fog = new THREE.FogExp2(new THREE.Color(rendererColor), 0.05);

  const position = geometry.attributes.position;
  position.usage = THREE.DynamicDrawUsage;

  for (let i = 0; i < position.count; i++) {
    const z = Math.random() * 3 * Math.sin(Math.random() / 2);
    position.setZ(i, z);
  }

  camera.position.z = 5;

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  sunLight.target = plane;

  plane.rotateX(250);
  plane.position.z = -10;

  //parametrics

  class Precipitation {
    constructor(type = "rain") {
      const rainGeo = new THREE.SphereGeometry(0.03, 0.03, 0.03);
      const rainMaterial = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: true,
      });

      const rainCount = type === "rain" || type === "snow" ? 1500 : 3500;
      const rain = new THREE.Object3D();

      for (let i = 0; i < rainCount; i++) {
        let rainDrop = new THREE.Mesh(rainGeo, rainMaterial);
        rainDrop.position.set(
          Math.random() * 50 - 25,
          Math.random() * 30 - 15,
          Math.random() * 30 - 35
        );
        rain.add(rainDrop);
      }

      rain.speed = type === "rain" ? 0.07 : type === "snow" ? 0.04 : 0.1;

      return rain;
    }
  }

  const precipitation = new Precipitation(weatherType);
  (weatherType === "rain" ||
    weatherType === "drizzle" ||
    weatherType === "snow" ||
    weatherType === "thunderstorm") &&
    scene.add(precipitation);

  const lightninig = new THREE.PointLight("rgba(30, 50, 150)", 200, 100);
  lightninig.position.set(0, 40, -60);
  lightninig.visible = false;
  weatherType === "thunderstorm" && scene.add(lightninig);

  const clouds = new THREE.Object3D();

  const loader = new THREE.TextureLoader();
  loader.load("./cloud.png", function (texture) {
    const cloudGeo = new THREE.PlaneBufferGeometry(10, 10);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
    });

    for (let p = 0; p < 25; p++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(Math.random() * 60 - 30, 5, Math.random() * 5 - 5);
      cloud.rotation.x = 1.3;
      cloud.rotation.y = 0;
      cloud.rotation.z = Math.random() * 360;
      cloud.material.opacity = 0.8;
      clouds.add(cloud);
    }
  });

  clouds.rotation.x = 0.3;

  (weatherType === "clouds" ||
    weatherType === "rain" ||
    weatherType === "drizzle" ||
    weatherType === "thunderstorm") &&
    scene.add(clouds);

  const animate = function () {
    window.requestAnimationFrame(animate);

    precipitation.children.forEach((p) => {
      p.position.y -= precipitation.speed + Math.random() * 0.03;

      if (p.position.y < -10) {
        p.position.y = 15;
      }
    });

    if (Math.random() * 55 < 0.95 && Math.random() * 55 > 0.4) {
      lightninig.position.setX(Math.floor(Math.random() * 60) - 30);
      lightninig.visible = true;
      lightninig.intensity = Math.floor(Math.random() * 50);
    } else {
      lightninig.visible = false;
    }

    plane.rotation.z += 0.001;

    clouds.children.forEach((c) => {
      c.position.z < -20 ? (c.position.z = -5) : (c.position.z -= 0.01);
    });
    // clouds.rotation.z += 0.001;

    composer.render(0.1);
  };

  animate();

  const mouseMoveHandler = (e) => {
    camera.rotation.x = (e.pageY - window.innerHeight) / 10000;
    camera.rotation.y = (e.pageX - window.innerWidth) / 10000;
  };

  listeners.mouseMoveHandler = mouseMoveHandler;

  document.body.addEventListener("mousemove", mouseMoveHandler);
};

export default { initScene, listeners };
