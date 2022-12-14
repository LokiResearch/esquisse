/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Wed Sep 28 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { Bone, Skeleton, Vector3 } from "three";

const _pos = new Vector3();

/**
 * Returns the parent bone of the hiven bone.
 * @param bone The bone
 * @returns Parent bone or null
 */
export function parentBone(bone: Bone) {
  const parent = bone.parent as Bone;
  if (parent.isBone) {
    return parent;
  }
  return null;
}

/**
 * Returns the **direct** children bones of the given bone.
 * @param bone The bone
 * @returns Array of chidlren bones
 */
export function childrenBones(bone: Bone) {
  const bones = new Array<Bone>();
  for (const child of bone.children) {
    if ((child as Bone).isBone) {
      bones.push(child as Bone);
    }
  }
  return bones;
}

/**
 * Returns the root bone (i.e. top most hierarchical bone without parent bone)
 * of the given bone.
 * @param bone The bone
 * @returns The root bone of the bone
 */
export function rootBone(bone: Bone) {
  let parent = parentBone(bone);
  while (parent) {
    bone = parent;
    parent = parentBone(bone);
  }
  return bone;
}

/**
 * Returns the root bones (i.e. top most hierarchical bone without parent bone)
 * of the given skeleton.
 * @param skeleton The skeleton
 * @returns The root bones of the skeleton
 */
export function rootBones(skeleton: Skeleton) {
  return skeleton.bones.filter(b => parentBone(b) === null);
}

/**
 * Returns the closest bone to the given target from the given Skinned Mesh.
 * @param mesh The SkinnedMesh to search for the closest bone
 * @param target The target position in world space
 * @returns The closest bone if any
 */
export function closestBoneFromPoint(skeleton: Skeleton, target: Vector3) {

  let closestBone: Bone | null = null;
  let distance = Infinity;

  for (const bone of skeleton.bones) {
    bone.getWorldPosition(_pos);
    const d = target.distanceTo(_pos);
    if (d < distance) {
      distance = d;
      closestBone = bone;
    }
  }

  return closestBone
}