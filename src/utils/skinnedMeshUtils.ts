// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 26/04/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import { SkinnedMesh, Vector3, Box3, Sphere } from "three";

const _min = new Vector3();
const _max = new Vector3();
const _pos = new Vector3();

/**
 * Updates SkinnedMesh boundingBox and boundingSphere by iterating over the
 * geometry triangles.
 * @param skinnedMesh The SkinnedMesh to update bounding volumes
 * @param triStep Size of the intervalle between triangles position to process, e.g. 3 means 1 position of each triangle is processed
 * @returns 
 */
export function updateBoundingVolumesFromGeometry(
    mesh: SkinnedMesh,
    step = 3
) {

  if (step <1) step = 1;

  const geometry = mesh.geometry;

  const positionBuffer = geometry.getAttribute('position');
  if (!positionBuffer) {
    console.error("SkinnedMesh geometry has no position attribute to update bounding box");
    return;
  }
  const indexBuffer = geometry.getIndex();

  _min.set(Infinity, Infinity, Infinity);
  _max.set(-Infinity, -Infinity, -Infinity);

  const size = indexBuffer ? indexBuffer.count : positionBuffer.count;
  for (let i=0; i<size; i += step) {
    const idx = indexBuffer ? indexBuffer.array[i] : i;
    _pos.fromBufferAttribute(positionBuffer, idx);
    mesh.boneTransform(idx, _pos);

    _min.x = Math.min(_min.x, _pos.x);
    _min.y = Math.min(_min.y, _pos.y);
    _min.z = Math.min(_min.z, _pos.z);
    _max.x = Math.max(_max.x, _pos.x);
    _max.y = Math.max(_max.y, _pos.y);
    _max.z = Math.max(_max.z, _pos.z);

  }

  // Update the bounding box
  if (!geometry.boundingBox) geometry.boundingBox = new Box3();
  geometry.boundingBox.set(_min, _max);

  // Update the bounding sphere
  if (!geometry.boundingSphere) geometry.boundingSphere = new Sphere();
  geometry.boundingBox.getBoundingSphere(geometry.boundingSphere);

}



