import * as THREE from 'three';

export const CONFIG = {
  stem: {
    height: 2.5,
    radiusTop: 0.035,
    radiusBottom: 0.055,
    color: 0x2e8b57,
  },
  innerPetals: {
    count: 5,
    width: 0.28,
    length: 0.55,
    budColor: new THREE.Color(0x8b2252),
    bloomColor: new THREE.Color(0xff69b4),
    openAngle: Math.PI / 2.3,
  },
  outerPetals: {
    count: 8,
    width: 0.33,
    length: 0.7,
    budColor: new THREE.Color(0x6b1a3a),
    bloomColor: new THREE.Color(0xffb6c1),
    openAngle: Math.PI / 1.95,
  },
  center: {
    radius: 0.14,
    color: 0xffd700,
  },
};

function createPetalGeometry(width, length) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(
    width * 0.55, length * 0.2,
    width * 0.4, length * 0.7,
    0, length
  );
  shape.bezierCurveTo(
    -width * 0.4, length * 0.7,
    -width * 0.55, length * 0.2,
    0, 0
  );

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.012,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
  });

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const ny = pos.getY(i) / length;
    pos.setZ(i, pos.getZ(i) - ny * ny * length * 0.12);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.translate(0, 0, -0.006);

  return geo;
}

function buildPetalRing(count, width, length, material, yOffset) {
  const geo = createPetalGeometry(width, length);
  const petals = [];

  for (let i = 0; i < count; i++) {
    const spacer = new THREE.Group();
    spacer.rotation.y = (i / count) * Math.PI * 2 + yOffset;

    const opener = new THREE.Group();
    const mesh = new THREE.Mesh(geo, material);
    opener.add(mesh);
    spacer.add(opener);

    petals.push({ spacer, opener, mesh });
  }

  return petals;
}

function createLeafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.07, 0.07, 0.055, 0.2, 0, 0.28);
  s.bezierCurveTo(-0.055, 0.2, -0.07, 0.07, 0, 0);
  return new THREE.ShapeGeometry(s);
}

export function createFlower() {
  const group = new THREE.Group();

  // Stem
  const stemGeo = new THREE.CylinderGeometry(
    CONFIG.stem.radiusTop, CONFIG.stem.radiusBottom, CONFIG.stem.height, 8
  );
  stemGeo.translate(0, CONFIG.stem.height / 2, 0);
  const stemMat = new THREE.MeshStandardMaterial({
    color: CONFIG.stem.color,
    roughness: 0.85,
  });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.scale.y = 0.001;
  group.add(stem);

  // Flower head (petals + center attach here)
  const head = new THREE.Group();
  group.add(head);

  // Pistil center
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(CONFIG.center.radius, 16, 12),
    new THREE.MeshStandardMaterial({
      color: CONFIG.center.color,
      roughness: 0.4,
      metalness: 0.1,
    })
  );
  center.scale.setScalar(0.001);
  head.add(center);

  // Inner petal ring
  const innerMat = new THREE.MeshStandardMaterial({
    color: CONFIG.innerPetals.budColor.clone(),
    side: THREE.DoubleSide,
    roughness: 0.55,
    metalness: 0.05,
  });
  const innerPetals = buildPetalRing(
    CONFIG.innerPetals.count,
    CONFIG.innerPetals.width,
    CONFIG.innerPetals.length,
    innerMat,
    0
  );
  innerPetals.forEach(p => head.add(p.spacer));

  // Outer petal ring — offset angularly so petals interleave with inner ring
  const outerMat = new THREE.MeshStandardMaterial({
    color: CONFIG.outerPetals.budColor.clone(),
    side: THREE.DoubleSide,
    roughness: 0.55,
    metalness: 0.05,
  });
  const outerPetals = buildPetalRing(
    CONFIG.outerPetals.count,
    CONFIG.outerPetals.width,
    CONFIG.outerPetals.length,
    outerMat,
    Math.PI / CONFIG.outerPetals.count
  );
  outerPetals.forEach(p => head.add(p.spacer));

  // Leaves on stem
  const leafGeo = createLeafGeometry();
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x3da35d,
    side: THREE.DoubleSide,
    roughness: 0.8,
  });

  const leaves = [
    { heightFraction: 0.35, yRot: 0.3, zTilt: -0.5, targetScale: 1.6 },
    { heightFraction: 0.55, yRot: Math.PI + 0.5, zTilt: -0.45, targetScale: 1.3 },
  ].map(cfg => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(leafGeo, leafMat);
    m.position.x = CONFIG.stem.radiusBottom + 0.01;
    m.rotation.z = cfg.zTilt;
    g.add(m);
    g.rotation.y = cfg.yRot;
    g.scale.setScalar(0.001);
    g.userData.heightFraction = cfg.heightFraction;
    g.userData.targetScale = cfg.targetScale;
    group.add(g);
    return g;
  });

  return { group, stem, head, center, innerPetals, outerPetals, innerMat, outerMat, leaves };
}
