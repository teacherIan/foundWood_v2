import * as THREE from 'three';

export const colors = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#f59e0b',
  wood: '#8b4513',
  metal: '#708090',
  glass: '#87ceeb',
};

export const materials = {
  wood: new THREE.MeshStandardMaterial({
    color: colors.wood,
    roughness: 0.8,
    metalness: 0.1,
  }),

  metal: new THREE.MeshStandardMaterial({
    color: colors.metal,
    roughness: 0.2,
    metalness: 0.9,
  }),

  glass: new THREE.MeshPhysicalMaterial({
    color: colors.glass,
    transparent: true,
    opacity: 0.3,
    roughness: 0,
    transmission: 1,
    thickness: 0.5,
  }),
};

export const geometries = {
  box: (width = 1, height = 1, depth = 1) =>
    new THREE.BoxGeometry(width, height, depth),
  sphere: (radius = 1, segments = 32) =>
    new THREE.SphereGeometry(radius, segments, segments),
  cylinder: (radiusTop = 1, radiusBottom = 1, height = 1) =>
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height),
};
