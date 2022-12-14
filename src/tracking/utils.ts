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

import { Bone } from "three";

export function parentBone(bone: Bone) {

  let parent = bone.parent as Bone;
  if (parent.isBone) {
    return parent;
  }
  return null;
}

export function childrenBones(bone: Bone) {

  const bones = new Array<Bone>();
  for (const child of bone.children) {
    if ((child as Bone).isBone) {
      bones.push(child as Bone);
    }
  }
  return bones;
}

export function rootBone(bone: Bone) {
  let parent = parentBone(bone);
  while (parent) {
    bone = parent;
    parent = parentBone(bone);
  }
  return bone;
}