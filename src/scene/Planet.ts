import * as THREE from "three";

export class Planet {
  public mesh: THREE.Mesh;
  public orbitRadius: number;
  public orbitSpeed: number;
  public orbitAngle: number = 0;

  constructor(radius: number, color: string, orbitRadius: number, orbitSpeed: number) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);

    this.orbitRadius = orbitRadius;
    this.orbitSpeed = orbitSpeed;
  }

  update(delta: number) {
    this.orbitAngle += this.orbitSpeed * delta;
    this.mesh.position.x = Math.cos(this.orbitAngle) * this.orbitRadius;
    this.mesh.position.z = Math.sin(this.orbitAngle) * this.orbitRadius;
  }

  spin() {
    // rotate the planet along Y axis
    this.mesh.rotation.y += Math.PI / 8;
  }
}
