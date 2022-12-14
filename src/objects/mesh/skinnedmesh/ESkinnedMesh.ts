// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 22/10/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import { SkinnedMesh, BufferGeometry, MeshStandardMaterial } from 'three';
import { EMesh } from '..';
import { ESkeleton } from './ESkeleton';
import { updateBoundingVolumesFromGeometry } from '/utils';
import { SkinnedMeshIcon } from '/ui/Icons';

export type ESkinnedMeshBase = 
  SkinnedMesh<BufferGeometry, MeshStandardMaterial | MeshStandardMaterial[]>;
export const ESkinnedMeshBase = 
SkinnedMesh<BufferGeometry, MeshStandardMaterial | MeshStandardMaterial[]>;

export class ESkinnedMesh extends EMesh<ESkinnedMeshBase> {

  readonly isSkinnedMesh = true;
  readonly type: string = "SkinnedMesh";
  readonly shortText = "SKM";
  readonly icon = SkinnedMeshIcon;
  readonly skeleton: ESkeleton;

  constructor(skinnedMesh = new ESkinnedMeshBase()) {
    super(skinnedMesh);

    this.skeleton = new ESkeleton(skinnedMesh.skeleton);
    
    
    const roots = this.skeleton.rootBones;
    if (roots.length > 0) {
      this.transformProxyObject = roots[0];
    }

  }

  updateBoundingVolumes() {
    updateBoundingVolumesFromGeometry(this.threeObject);
  }

}

