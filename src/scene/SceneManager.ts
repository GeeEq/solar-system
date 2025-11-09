import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Planet } from "./Planet";

export class SceneManager {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private controls: OrbitControls;
  private clock = new THREE.Clock();

  private planets: Planet[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.position.set(0, 200, 600);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambient);

    const sunLight = new THREE.PointLight(0xffffff, 1.5, 0, 2);
    sunLight.position.set(0,0,0);
    this.scene.add(sunLight);

    this.createSolarSystem();

    window.addEventListener("resize", () => this.onResize());
    canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));

    this.tick();
  }

  private createSolarSystem() {
    // Sun
    const sunGeo = new THREE.SphereGeometry(50, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    this.scene.add(sun);

    // Planets: radius, color, orbitRadius, orbitSpeed
    this.planets.push(new Planet(8, "#6b93ff", 90, 0.5));
    this.planets.push(new Planet(12, "#ff6b6b", 140, 0.35));
    this.planets.push(new Planet(10, "#42f5b0", 200, 0.25));
    this.planets.push(new Planet(14, "#ffdf7a", 260, 0.15));

    this.planets.forEach(p => this.scene.add(p.mesh));
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onPointerDown(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planets.map(p => p.mesh));

    if (intersects.length > 0) {
      const planet = this.planets.find(p => p.mesh === intersects[0].object);
      planet?.spin();
    }
  }

  private tick = () => {
    requestAnimationFrame(this.tick);
    const delta = this.clock.getDelta();

    this.planets.forEach(p => p.update(delta));

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
