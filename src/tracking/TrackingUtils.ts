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

import type { Hand, Keypoint as HandKeypoint } from "@tensorflow-models/hand-pose-detection";
import type { Pose, Keypoint as PoseKeypoint } from "@tensorflow-models/pose-detection";
import { Matrix4, Quaternion, SkinnedMesh, Vector3, Color, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments } from "three";
import { Editor } from "/editor/Editor";
import { rootBone, childrenBones } from './utils';

const PoseMinimalScore = 0.3;
const HandMinimalScore = 0.3;
const _vec1 = new Vector3();
const _vec2 = new Vector3();
const _vec3 = new Vector3();

const _dir = new Vector3();
const _lastDir = new Vector3();
const _q1 = new Quaternion();
const _mat = new Matrix4();

interface Keypoint3D {
  x: number;
  y: number;
  z: number;
  name: string;
}

const TFHand = {
  wrist: 0,
  thumb: [1, 2, 3, 4],
  index: [5, 6, 7, 8],
  middle: [9, 10, 11, 12],
  ring: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20],
};

abstract class SkeletonLinesHelper extends LineSegments {

  readonly isSkeletonLinesHelper = true;
  readonly type = "SkeletonLinesHelper";

  constructor (skeletonSize: number, primaryColor = 'red'||'blue',) {

    const geometry = new BufferGeometry();

    const vertices = [];
    const colors = [];

    let color1 = new Color(0, 0, 1);
    if (primaryColor === "red") {
      color1 = new Color(1, 0, 0);
    }

    const color2 = new Color(0, 1, 0);

    for (let i = 0; i < skeletonSize; i ++) {
      vertices.push(0, 0, 0);
      vertices.push(0, 0, 0);
      colors.push(color1.r, color1.g, color1.b);
      colors.push(color2.r, color2.g, color2.b);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const material = new LineBasicMaterial({
      vertexColors: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      transparent: true
    });

    super(geometry, material);

    this.matrixAutoUpdate = false;
  }
}

class TFHandHelper extends SkeletonLinesHelper {

  constructor(primaryColor = 'red' || 'blue') {
    super(21, primaryColor);
  }

  updateFromHand (hand: Hand, scale=1) {

    const position = this.geometry.getAttribute('position');

    let j=0;
    let p;
    const points = hand.keypoints3D as Array<Keypoint3D>;

    const fingers = [
      TFHand.thumb, TFHand.index, TFHand.pinky, TFHand.middle, TFHand.ring
    ];

    for (const finger of fingers) {

      if (finger.length > 0) {

        p = points[TFHand.wrist];
        position.setXYZ(j, p.x*scale, p.y*scale, p.z*scale);
        p = points[finger[0]];
        position.setXYZ(j+1, p.x*scale, p.y*scale, p.z*scale);
        j += 2;

        for (let i=0; i< finger.length -1; i++) {
          p = points[finger[i]];
          position.setXYZ(j, p.x*scale, p.y*scale, p.z*scale);
          p = points[finger[i+1]];
          position.setXYZ(j+1, p.x*scale, p.y*scale, p.z*scale);
          j += 2;
        }
      }
    }

    getPalmMatrix(hand, _mat);
    _mat.invert();
    position.applyMatrix4(_mat);
    position.needsUpdate = true;

    super.updateMatrixWorld(true);
  }
}






const leftHandHelper = new TFHandHelper("red");
const rightHandHelper = new TFHandHelper("blue");

function showHandHelper (editor: Editor, hand: Hand, scale = 5) {

  if (hand.keypoints3D) {
    let helper = leftHandHelper;
    if (hand.handedness === 'Right') {
      helper = rightHandHelper;
    } 
    
    editor.scene.threeObject.add(helper);
    helper.updateFromHand(hand, scale);
  }
}





/**
 * We assume that three bones name are hand-pose-detection bones name + a suffix
 * of handedness such as "_L" or "_R"
 * @param mesh 
 * @param hands 
 * @returns 
 */
export function applyHandPose(editor: Editor, mesh: SkinnedMesh, hands: Hand[]) {

  if (hands.length === 0) {
    return false;
  }

  const skeleton = mesh.skeleton;
  if (mesh.skeleton.bones.length === 0) {
    return false;
  }

  editor.scene.threeObject.remove(leftHandHelper);
  editor.scene.threeObject.remove(rightHandHelper);

  for (const hand of hands) {

    showHandHelper(editor, hand, 10);

    if (hand.keypoints3D && hand.score >= HandMinimalScore) {

      const points = hand.keypoints3D as Array<Keypoint3D>;
      
      const suffix = hand.handedness === 'Left' ? '_L' : '_R';

      getPalmMatrix(hand, _mat);
      _mat.invert();
    

      let bone = skeleton.getBoneByName('elbow'+suffix);

      // Now orient the fingers
      const fingers = [
        TFHand.thumb, TFHand.index, TFHand.pinky, TFHand.middle, TFHand.ring
      ];
  
      for (const finger of fingers) {

        // Get the direction between the wrist of the bone finger bone
        const curr = points[TFHand.wrist];
        const next = points[finger[0]];
        _vec1.set(curr.x, curr.y, curr.z).applyMatrix4(_mat);
        _vec2.set(next.x, next.y, next.z).applyMatrix4(_mat);
        _lastDir.subVectors(_vec2, _vec1).normalize();

        for (let i=0; i<finger.length-1; i++) {
          const curr = points[finger[i]];
          const next = points[finger[i+1]];
          _vec1.set(curr.x, curr.y, curr.z).applyMatrix4(_mat);
          _vec2.set(next.x, next.y, next.z).applyMatrix4(_mat);
          _dir.subVectors(_vec2, _vec1).normalize();
          _q1.setFromUnitVectors(_lastDir, _dir);
          
          _lastDir.copy(_dir);

          bone = skeleton.getBoneByName(curr.name+suffix);
          if (bone) {
            bone.quaternion.copy(_q1);
            bone.updateMatrixWorld();
          } else {
            console.warn(`Bone ${curr.name+suffix} not found.`)
          }

        }
      }
    }
  }
  
  return true;
}


const _palmNormal = new Vector3();
const _palmIndexDir = new Vector3();
const _palmThumbDir = new Vector3();
export function getPalmMatrix(hand: Hand, mat: Matrix4) {

  const points = hand.keypoints3D as Array<Keypoint3D>;

  // Wrist position
  const wrist = points[TFHand.wrist];
  _vec1.set(wrist.x, wrist.y, wrist.z);

  // Direction between index finger and wrist
  const index = points[TFHand.index[0]];
  _vec2.set(index.x, index.y, index.z).sub(_vec1).normalize();

  // Direction between ring finger and wrist
  const ring = points[TFHand.ring[0]];
  _vec3.set(ring.x, ring.y, ring.z).sub(_vec1).normalize();

  // Direction between middle finger and wrist, i.e. palm direction via middle
  const middle = points[TFHand.middle[0]]; 
  _palmIndexDir.set(middle.x, middle.y, middle.z).sub(_vec1).normalize();

  if (hand.handedness === "Left") {
    _palmNormal.crossVectors(_vec3, _vec2).normalize();
  } else {
    _palmNormal.crossVectors(_vec2, _vec3).normalize();
  }  

  _palmThumbDir.crossVectors(_palmNormal, _palmIndexDir).normalize();

  return mat.makeBasis(_palmThumbDir, _palmIndexDir, _palmNormal);
}



export function applyPose(mesh: SkinnedMesh, poses: Pose[]) {
  
  if (poses.length === 0) {
    return false;
  }

  const skeleton = mesh.skeleton;
  if (mesh.skeleton.bones.length === 0) {
    return false;
  }


  const pose = poses[0];

  if (!pose.keypoints3D) {
    return false;
  }

  /**
   * Get the keypoints with a valid name, z coordinates and above minimal score
   */
  const keypointsMap = get3DPointsMap(pose.keypoints3D, PoseMinimalScore);

  /**
   * Iterate over the skeleton bones
   */
  const root = rootBone(skeleton.bones[0]);
  const bonesToHandle = [...childrenBones(root)];
  while (bonesToHandle.length > 0) {
    // Get the first bone
    const bone = bonesToHandle.shift();
    if (bone) {
      // Get the keypoint with the same name
      const keypoint = keypointsMap.get(bone.name);
      if (keypoint) {
        _vec1.set(keypoint.x, keypoint.y, keypoint.z);
        // if (bone.parent) {
        //   bone.parent.worldToLocal(vec_);
        // }
        bone.position.copy(_vec1);
      }


      // Get the children bones
      const children = childrenBones(bone);
      bonesToHandle.push(...children);

    }
  }

  return true;

}

function get3DPointsMap(
    keypoints: HandKeypoint[] | PoseKeypoint[],
    minScore: number,
    suffix = ""
) {

  const keypointsMap = new Map<string, Keypoint3D>();
  let score;

  for (const keypoint of keypoints) {
    score = keypoint.score ?? 0;
    if (keypoint.name && keypoint.z !== undefined && score >= minScore) {
      keypointsMap.set(keypoint.name+suffix, keypoint as Keypoint3D);
    }
  }

  return keypointsMap;
}

