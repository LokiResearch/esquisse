// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 03/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { Mesh, MeshStandardMaterial, TorusGeometry, BoxGeometry, BufferGeometry,
  MeshStandardMaterialParameters, TorusKnotGeometry, CylinderGeometry,
  SphereGeometry, PlaneGeometry, MeshBasicMaterialParameters, MeshBasicMaterial } from 'three';

export enum MeshType {
  CUBE = "cube",
  TORUS = "torus",
  KNOT = "knot",
  CYLINDER = "cylinder",
  SPHERE = "sphere",
  PLANE = "plane",
}

export type StandardMeshOptions = MeshStandardMaterialParameters

export type BasicMeshOptions = MeshBasicMaterialParameters

export class MeshFactory {

  static getStandardMesh(
      type: MeshType,
      options: StandardMeshOptions = {color: 0xAAAAAA}) {

    const material = new MeshStandardMaterial(options);
    const geometry = geometryForType(type);
    const mesh = new Mesh(geometry, material);
    mesh.name = type;
    return mesh;
  }

  static getBasicMesh(
      type: MeshType,
      options: BasicMeshOptions = {color: 0xAAAAAA}) {

    const material = new MeshBasicMaterial(options);
    const geometry = geometryForType(type);
    const mesh = new Mesh(geometry, material);
    mesh.name = type;
    return mesh;
  }
}

function geometryForType(type: MeshType): BufferGeometry {
  switch (type) {
  case MeshType.TORUS:
    return new TorusGeometry(1, 0.3, 10, 20);
  case MeshType.CUBE:
    return new BoxGeometry(1,1,1);
  case MeshType.KNOT:
    return new TorusKnotGeometry(1, 0.3, 100, 15);
  case MeshType.CYLINDER:
    return new CylinderGeometry(0.5, 0.5, 1, 20);
  case MeshType.SPHERE:
    return new SphereGeometry(1, 15, 15);
  case MeshType.PLANE:
    return new PlaneGeometry(1,1);
  default:
    return new BoxGeometry(1,1,1);
  }
}
