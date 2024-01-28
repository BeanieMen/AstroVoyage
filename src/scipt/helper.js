import * as THREE from 'three';
export function createPlanete(size, texture, position, ring, orbitalRing) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    if (orbitalRing){
        const orbitGeo = new THREE.RingGeometry(
            orbitalRing.innerRadius,
            orbitalRing.outerRadius,
            300);
        const orbitMat = new THREE.MeshBasicMaterial({
            colot: 0xffffff,
            side: THREE.DoubleSide
        });
        const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
        obj.add(orbitMesh);
        orbitMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}