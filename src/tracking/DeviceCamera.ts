// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 05/08/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

type FacingMode = 'user' | 'environment';

export class DeviceCamera {

  private stream: MediaStream | null = null;
  readonly video: HTMLVideoElement;

  private readonly requestedWidth: number;
  private readonly requestedHeight: number;
  private readonly requestedFacingMode: FacingMode;

  /** 
   * 16/9 definitions :
   * - 320 x 180
   * - 480 x 270
   * - 640 x 360
   * - 1280 x 720
   * 
   */ 

  constructor (width = 480, height = 270, mode: FacingMode = 'user') {

    navigator.mediaDevices.getSupportedConstraints().facingMode


    this.video = document.createElement('video');
    this.requestedWidth = width;
    this.requestedHeight = height;
    this.requestedFacingMode = mode;
  }

  get width() {
    return this.video.width;
  }

  get height() {
    return this.video.height;
  }

  private async setupStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: this.requestedFacingMode,
        width: this.requestedWidth,
        height: this.requestedHeight,
      }
    });

    const videoTracks = this.stream.getVideoTracks();
    if (videoTracks.length > 0) {
      const track = videoTracks[0].getSettings();
      this.video.width = track.width ?? this.requestedWidth;
      this.video.height = track.height ?? this.requestedHeight;
    }

    this.video.srcObject = this.stream;
    
  }

  async start() {

    if (!this.stream) {
      await this.setupStream();
    }

    await this.isReady;
    this.video.play();
  }

  async stop() {
    this.video.pause();
  }

  async dispose() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
      this.stream = null;
      this.video.srcObject = null;
    }
  }

  drawInCanvas(canvas: HTMLCanvasElement, flip = false) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      if (flip) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  }

  get isReady() {
    return new Promise<void>((resolve) => {
      if (this.video.readyState === HTMLMediaElement.HAVE_NOTHING ||
        this.video.readyState === HTMLMediaElement.HAVE_CURRENT_DATA) {
          this.video.onloadeddata = () => {
            resolve();
          }
      } else {
        resolve();
      }
    });
  }
}