// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 02/07/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { DeviceCamera } from "./DeviceCamera";
import type {Pose, PoseDetector} from '@tensorflow-models/pose-detection';
import type {Hand, HandDetector} from '@tensorflow-models/hand-pose-detection';
import {SupportedModels as SupportedPoseModels} from '@tensorflow-models/pose-detection';
import {SupportedModels as SupportedHandModels} from '@tensorflow-models/hand-pose-detection';
import { drawPoses2d, drawHands2d } from "./DrawingUtils";

export enum TrackingMode {
  Body = "Body",
  Hand = "Hand",
}

export type PoseListener = (poses: Pose[]) => void;
export type HandListener = (hands: Hand[]) => void;

export class TrackingManager {

  readonly poseModel = SupportedPoseModels.PoseNet;
  readonly handModel = SupportedHandModels.MediaPipeHands;

  private _flip = true;

  private poseDetector: PoseDetector | null = null;
  private handDetector: HandDetector | null = null;

  private poseListeners = new Array<PoseListener>();
  private handListeners = new Array<HandListener>();

  private isTracking = false;
  readonly camera = new DeviceCamera();
  trackingMode = TrackingMode.Hand;

  async start() {
    this.isTracking = true;
    await this.camera.start();
    await this.track();
   }

  async stop() {
    this.isTracking = false;
    this.camera.stop();
  }

  async dispose() {
    this.isTracking = false;
    this.camera.stop();
    if (this.handDetector) {
      this.handDetector.dispose();
      this.handDetector = null;
    }
    if (this.poseDetector) {
      this.poseDetector.dispose();
      this.poseDetector = null;
    }
  }

  private track = async () => {

    if (this.trackingMode === TrackingMode.Body) {
      await this.trackBodies();
    } else if (this.trackingMode === TrackingMode.Hand) {
      await this.trackHands();
    }

    if (this.isTracking) {
      requestAnimationFrame(this.track);
    }
  }

  private async createBodyDetector() {

    await import(
      /* webpackChunkName: "tfjs-backend" */
      '@tensorflow/tfjs-backend-webgl'
    );
    const {createDetector} = await import (
      /* webpackChunkName: "tfjs-pose-detection" */
      '@tensorflow-models/pose-detection'
    );

    return createDetector(
      this.poseModel, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
        modelType: 'full'
      }
    );
  }

  private async createHandDetector() {
    
    await import(
      /* webpackChunkName: "tfjs-backend" */
      '@tensorflow/tfjs-backend-webgl'
    );
    const {createDetector} = await import (
      /* webpackChunkName: "tfjs-hand-pose-detection" */
      '@tensorflow-models/hand-pose-detection'
    );

    return createDetector(
      this.handModel, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        modelType: 'full',
      }
    );
  }

  set flipHorizontal(value: boolean) {
    this._flip = value;
    this.handDetector?.reset();
    this.poseDetector?.reset();
  }

  get flipHorizontal(): boolean {
    return this._flip;
  }

  drawPoses(canvas: HTMLCanvasElement, poses: Pose[]) {

    this.camera.drawInCanvas(canvas, this._flip);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const sx = canvas.width / this.camera.width;
      const sy = canvas.height / this.camera.height;

      ctx.save()
      ctx.scale(sx, sy);

      // if (this._flip) {
      //   ctx.translate(canvas.width, 0);
      //   ctx.scale(-sx, sy);
      // }
      drawPoses2d(ctx, this.poseModel, poses);
      ctx.restore();
    }
  }

  drawHands(canvas: HTMLCanvasElement, hands: Hand[]) {

    this.camera.drawInCanvas(canvas, this._flip);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const sx = canvas.width / this.camera.width;
      const sy = canvas.height / this.camera.height;

      ctx.save();
      ctx.scale(sx, sy);

      // if (this._flip) {
      //   ctx.translate(this.camera.width, 0);
      //   ctx.scale(-sx, sy);
      // }
      drawHands2d(ctx, hands);
      ctx.restore();
    }
  }

  //#############################################################################
  //                            Body pose detection
  //#############################################################################

  private async trackBodies() {
    if (!this.poseDetector) {
      this.poseDetector = await this.createBodyDetector();
    }

    const poses = await this.poseDetector.estimatePoses(
      this.camera.video, {
        flipHorizontal: this._flip
      }
    );

    for (const listener of this.poseListeners) {
      listener(poses);
    }
  }

  addPoseListener(listener: PoseListener) {
    if (!this.poseListeners.includes(listener)) {
      this.poseListeners.push(listener);
    }
  }

  removePoseListener(listener: PoseListener) { 
    this.poseListeners.remove(listener);
  }

  //#############################################################################
  //                            Hand pose detection
  //#############################################################################

  private async trackHands() {
    if (!this.handDetector) {
      this.handDetector = await this.createHandDetector();
    }

    const hands = await this.handDetector.estimateHands(
      this.camera.video, {
        flipHorizontal: this._flip
      }
    );

    for (const listener of this.handListeners) {
      listener(hands);
    }
  }

  addHandListener(listener: HandListener) {
    if (!this.handListeners.includes(listener)) {
      this.handListeners.push(listener);
    }
  }

  removeHandListener(listener: HandListener) {
    this.handListeners.remove(listener);
  }


}

