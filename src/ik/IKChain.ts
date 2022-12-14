// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 17/05/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import { Bone, Quaternion, Vector3 } from 'three';
import { parentBone, rootBone } from './utils';
import './augments';

export class IKBoneData {
  readonly chains = new Array<IKChain>();
  locked?: boolean;
  axisLimit?: Vector3;
  rotationMin?: Vector3;
  rotationMax?: Vector3;
}

export const MinSizeWarning = "IKChains cannot have a size less than 1";
export const NotEnoughBonesWarning = (size: number, actual: number) => 
  `Not enough bones for a size of ${size}, new size is ${actual}.`

interface IKBone extends Bone {
  ik: IKBoneData;
}

export class IKChain {

  lockTail = false;
  readonly target = new Vector3();
  readonly id: number;
  readonly bones: IKBone[];

  /**
   * Object describing a bottom-up ik chain of bones in a skeleton.

   */
  constructor(id: number, effector: Bone, size = 1) {
    
    this.id = id;
    
    if(!effector.ik) {
      effector.ik = new IKBoneData();
    }
    effector.ik.chains.push(this);
    this.bones = [effector as IKBone];

    this.setSize(size);
  }

  dispose() {
    // Remove the chain ref from the bones
    for (const bone of this.bones) {
      bone.ik.chains.remove(this);
    }
  }

  /**
   * Size
   */
  get size() {
    return this.bones.length-1;
  }

  get head() {
    return this.bones[0];
  }

  get effector() {
    return this.bones[0];
  }

  get tail() {
    return this.bones[this.bones.length-1];
  }

  getChildForBone(bone: Bone) {
    if (!bone.ik) {
      return null;
    }

    const idx = this.bones.indexOf(bone as IKBone);
    if (idx === -1 || idx === 0) {
      return null;
    }
    return this.bones[idx-1];

  }

  solve(iterations=3) {

    const tail = this.tail;
    if ((tail as Bone) === rootBone(tail)) {
      tail.ik.locked = true;
    }

    solveCCDChain(this, iterations);
  }

  canIncrease(delta = 1) {
    let bone: Bone | null = this.tail;
    for (let i=0; i<delta; i++) {
      bone = parentBone(bone);
      if (!bone) {
        return false;
      }
    }
    return true;
  }

  canDecrease(delta = 1) {
    return this.size - delta >= 1;
  }
  
  /**
   * Sets the chain size and returns whether the chain has been modified
   * @param size 
   * @returns 
   */
  setSize(size: number) {

    if (size < 1) {
      console.warn(MinSizeWarning);
      return false;
    }

    if (size === this.size) {
      return false;
    } else if (size > this.size) {
      // Add new bones
      const n = size - this.size;
      for (let i=0; i<n; i++) {
        const bone = parentBone(this.tail);
        if (bone) {
          if (!bone.ik) {
            bone.ik = new IKBoneData();
          }
          // Add the bone to the chain and add the chain ref to the bone
          bone.ik.chains.push(this);
          this.bones.push(bone as IKBone);
        } else {
          console.warn(NotEnoughBonesWarning(size, this.size));
          return true;
        }
      }
    } else if (size < this.size) {
      // Remove bones
      const n = this.size - size;
      for (let i=0; i<n; i++) {
        // Remove the bone from the chain and remove the chain ref from the bone
        const bone = this.bones.pop();
        bone?.ik.chains.remove(this);
      }
    }

    // Same size
    return true;
  }


}

// Kind of fork from https://github.com/mrdoob/three.js/blob/master/examples/jsm/animation/CCDIKSolver.js


const _q = new Quaternion();
const _bonePos = new Vector3();
const _invBoneQuat = new Quaternion();
const _boneScale = new Vector3();
const _effectorPos = new Vector3();
const _effectorVec = new Vector3();
const _targetVec = new Vector3();
const _axis = new Vector3();
const _vector = new Vector3();

/**
 * Resolves the IK constraint applied on the chain formed by the given IKBones.
 * IKBones are expected to be in parent-child relationships and sorted in the array
 * in a hierarchical order from top-most parent to children.
 * @param ikBones Bones composing the ikchain in top-bottom order
 * @param targetPos World position of the target
 * @param iterations Number of iterations of CCD algorithm to perform
 * @param minAngle Minimum rotation angle in a step
 * @param maxAngle Maximum rotation angle in a step
 */
export function solveCCDChain( 
    chain: IKChain,
    iterations = 1,
    minAngle?: number,
    maxAngle?: number
) {

  let rotated: boolean;
  const bones = chain.bones;
  const targetPos = chain.target;
  const effector = bones[0];

  const startIndex = chain.lockTail ? 
    chain.bones.length - 2 : chain.bones.length -1;

  for (let ite = 0; ite < iterations; ite++) {

    rotated = false;

    // Parent children order
    for (let j=startIndex; j>0; j--) {

      const bone = bones[j];

      const {locked = false, axisLimit, rotationMin, rotationMax} = bone.ik;

      if (!locked) {
      
        // don't use getWorldPosition/Quaternion() here for the performance
        // because they call updateMatrixWorld( true ) inside.
        bone.matrixWorld.decompose(_bonePos, _invBoneQuat, _boneScale);
        _invBoneQuat.invert();
        _effectorPos.setFromMatrixPosition(effector.matrixWorld);

        // work in link world
        _effectorVec.subVectors(_effectorPos, _bonePos);
        _effectorVec.applyQuaternion(_invBoneQuat);
        _effectorVec.normalize();

        _targetVec.subVectors(targetPos, _bonePos);
        _targetVec.applyQuaternion(_invBoneQuat);
        _targetVec.normalize();

        let angle = _targetVec.dot(_effectorVec);

        if (angle > 1.0) {

          angle = 1.0;

        } else if (angle < - 1.0) {

          angle = - 1.0;

        }

        angle = Math.acos(angle);

        // skip if changing angle is too small to prevent vibration of bone
        if (angle < 1e-5) continue;

        if (minAngle !== undefined && angle < minAngle) {
          angle = minAngle;
        }

        if (maxAngle !== undefined && angle > maxAngle) {
          angle = maxAngle;
        }

        _axis.crossVectors(_effectorVec, _targetVec);
        _axis.normalize();

        _q.setFromAxisAngle(_axis, angle);
        bone.quaternion.multiply(_q);

        // TODO: re-consider the limitation specification
        if (axisLimit !== undefined) {

          let c = bone.quaternion.w;

          if (c > 1.0) c = 1.0;

          const c2 = Math.sqrt(1 - c * c);
          bone.quaternion.set(
            axisLimit.x * c2,
            axisLimit.y * c2,
            axisLimit.z * c2,
            c
          );

        }

        if (rotationMin !== undefined) {
          bone.rotation.setFromVector3(
            _vector.setFromEuler(bone.rotation).max(rotationMin));
        }

        if (rotationMax !== undefined) {
          bone.rotation.setFromVector3(
            _vector.setFromEuler(bone.rotation).min(rotationMax));
        }

        bone.updateMatrixWorld(true);

        rotated = true;
      }
    }
  
    if (! rotated) break;

  }

}