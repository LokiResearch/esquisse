// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 05/05/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import { Skeleton, Vector3 } from 'three';
import { EBone } from './EBone';
import { closestBoneFromPoint } from '/utils';

export class ESkeleton {

  readonly skeleton : Skeleton;

  constructor(skeleton: Skeleton) {
    this.skeleton = skeleton;
  }

  get bones() {
    return this.skeleton.bones.map(b => b.eObject! as EBone);
  }

  closestBoneFromPoint(target: Vector3) {

    const closestBone = closestBoneFromPoint(this.skeleton, target);
    if (closestBone && closestBone.eObject) {
      return closestBone.eObject as EBone;
    }
    return null;
  }

  get rootBones() {
    const roots = [];
    for (const bone of this.bones) {
      if (bone.isRootBone) {
        roots.push(bone);
      }
    }
    return roots;
  }


}