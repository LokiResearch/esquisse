// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 10/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import * as THREE from 'three';
// import type {HalfEdgeStructure} from 'three-halfedge';

export class FaceNormalsHelper extends THREE.LineSegments {

  // structure: HalfEdgeStructure;
  // normalSize: number;
  // private v1: THREE.Vector3;
  // private v2: THREE.Vector3;
  // canBeExported = false;

  // constructor(structure: HalfEdgeStructure, normalSize = 0.3, color = 0xff0000) {
   
  //   super(new THREE.BufferGeometry(), 
  //     new THREE.LineBasicMaterial({color, toneMapped:false}));

  //   this.structure = structure;
  //   this.normalSize = normalSize;
  //   this.type = 'FaceNormalsHelper';

  //   this.matrixAutoUpdate = false;

  //   this.v1 = new THREE.Vector3();
  //   this.v2 = new THREE.Vector3();
  // }

  // buildGeometry() {
  //   const positions = new THREE.Float32BufferAttribute(
  //     this.structure.faces.length * 2*3, 3);
  //   this.geometry.setAttribute('position', positions);
  // }

  // update() {
  //   const position = this.geometry.attributes.position;
  //   let idx = 0;
  //   for (const face of this.structure.faces) {

  //     this.v1.copy(face.midpoint);
  //     this.v2.copy(face.normal).multiplyScalar(this.normalSize).add(this.v1);

  //     position.setXYZ( idx, this.v1.x, this.v1.y, this.v1.z );
  //     idx += 1;
  //     position.setXYZ( idx, this.v2.x, this.v2.y, this.v2.z );
  //     idx += 1;
  //   }

  //   position.needsUpdate = true;
  // }
}
