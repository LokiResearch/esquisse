// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 05/08/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import type { Pose, SupportedModels as SupportedPoseModels
} from '@tensorflow-models/pose-detection';
import {util as PoseUtil} from '@tensorflow-models/pose-detection'
import type { Hand } from '@tensorflow-models/hand-pose-detection';

const ColorPalette = [
  "#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"
];


const lineWidth = 2;
const pointRadius = 5;
const scoreThreshold = 0;
   
//##############################################################################
//                                  Pose drawing
// Adapted from https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/demos/live_video/src/camera.js
//##############################################################################


export function drawPoses2d(
    ctx: CanvasRenderingContext2D,
    model: SupportedPoseModels,
    poses: Pose[]) {

  for (const pose of poses) {
    const id = pose.id ?? 0;
    const color = ColorPalette[id % ColorPalette.length];


    // Draw keypoints
    ctx.fillStyle = 'White';
    ctx.strokeStyle = 'White';
    for (const keypoint of pose.keypoints) {
      drawPoint(ctx, keypoint, pointRadius);
    }

    // Draw a line between each adjacent pairs of keypoints
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    PoseUtil.getAdjacentPairs(model).forEach(([i, j]) => {
      const kp1 = pose.keypoints[i];
      const kp2 = pose.keypoints[j];

      // If score is null, just show the keypoint.
      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;

      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    });
    
  }
}

//##############################################################################
//                                  Hand drawing
// Adapted from https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/demos/live_video/src/camera.js
//##############################################################################

const fingers = [
  {name: "thumb", indices: [0, 1, 2, 3, 4]},
  {name: "indexFinger", indices: [0, 5, 6, 7, 8]},
  {name: "middleFinger", indices: [0, 9, 10, 11, 12]},
  {name: "ringFinger", indices: [0, 13, 14, 15, 16]},
  {name: "pinky", indices: [0, 17, 18, 19, 20]},
];

export function drawHands2d(
    ctx: CanvasRenderingContext2D,
    hands: Hand[]) {

  for (const hand of hands) {

    // Draw each keypoint
    ctx.strokeStyle = 'white';
    ctx.fillStyle = hand.handedness === 'Left' ? 'red' : 'blue';
    for (const keypoint of hand.keypoints) {
      drawPoint(ctx, keypoint, pointRadius);
    }

    // Draw a white line for each finger
    ctx.strokeStyle = 'white';
    ctx.lineWidth = lineWidth;
    for (const finger of fingers) {
      const points = finger.indices.map(i => hand.keypoints[i]);
      drawPath(ctx, points, false);
    }
    
    // Draw the handedness text under the wrist keypoint position
    ctx.strokeStyle = ctx.fillStyle;
    ctx.font = '30px';
    const txt = hand.handedness === 'Left' ? 'L' : 'R';
    const wrist = hand.keypoints[0];
    ctx.strokeText(txt, wrist.x-10, wrist.y+15);
  }
    
}

//##############################################################################

interface Point {
  x: number;
  y: number;
}

function drawPath(ctx: CanvasRenderingContext2D, points: Point[], closePath: boolean) {
  const region = new Path2D();
  region.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point.x, point.y);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

function drawPoint(ctx: CanvasRenderingContext2D, p: Point, radius: number) {
  
  const circle = new Path2D();
  circle.arc(p.x, p.y, radius, 0, 2 * Math.PI);
  ctx.fill(circle);
  ctx.stroke(circle);
}