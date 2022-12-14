// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 23/02/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Object3D, PerspectiveCamera, PointLight, Scene, Vector2, WebGLRenderer} from 'three';
// import {throttle} from 'lodash';
import {MeshFactory, MeshType} from '../../objects/mesh/MeshFactory';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass';
import { EScene, EObject } from '/objects';
import {Signal} from 'typed-signals';

const OutlinePassColor = 0xFFFFFF;

export class ViewportRenderer {

  readonly signals = {
    frameHasRendered: new Signal<(frametime: number)=>void>(),
  }

  readonly camera: PerspectiveCamera;
  readonly cameraFocusObject: Object3D;
  readonly renderer = new WebGLRenderer();
  private readonly effectComposer = new EffectComposer(this.renderer);
  private readonly outlinePass: OutlinePass;
  private readonly scenePass: RenderPass;
  private readonly helpersPass: RenderPass;
  private scene: EScene;
  private helpers: Scene;
  private readonly objectsHelpersGroup = new Object3D();
  verbose = false;


  constructor(scene: EScene, helpers: Scene) {

    this.scene = scene;
    this.helpers = helpers;

    // Setup viewport camera and its embedded light
    this.camera = new PerspectiveCamera();
    const cameraLight = new PointLight(0x555555);
    this.camera.add(cameraLight);
    cameraLight.position.set(-10, -10, 30);

    this.cameraFocusObject = MeshFactory.getBasicMesh(MeshType.CUBE, {color: 0xAAAA00});
    this.cameraFocusObject.scale.set(0.03, 0.03, 0.03);

    // Setup renderer
    this.scenePass = new RenderPass(scene.threeObject, this.camera);
    this.effectComposer.addPass(this.scenePass);

    this.helpersPass = new RenderPass(helpers, this.camera);
    this.effectComposer.addPass(this.helpersPass);

    // Helpers scene is drawn on top of objects scene, so we need to reset the
    // depth buffer and disable the clearing of the framebuffer for that pass
    this.helpersPass.clear = false;
    this.helpersPass.clearDepth = true;


    const passResolution = new Vector2(
      this.renderer.domElement.clientWidth/3,
      this.renderer.domElement.clientHeight/3
    );

    this.outlinePass = new OutlinePass(passResolution, scene.threeObject, this.camera);
    this.effectComposer.addPass(this.outlinePass);
    this.outlinePass.visibleEdgeColor.set(OutlinePassColor);
  }

  resize(width: number, height: number) {
    this.camera.aspect = width/height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.effectComposer.setSize(width, height);

    this.render("ViewportResize");
  }

  setOutlinedObjects(objects: Array<EObject>) {
    this.outlinePass.selectedObjects.clear();
    for (const obj of objects) {
      this.outlinePass.selectedObjects.push(obj.threeObject);
    }
  }

  setScene(scene: EScene) {
    console.log("Update scene renderer");

    this.scene = scene;
    this.scenePass.scene = scene.threeObject;
    this.outlinePass.renderScene = scene.threeObject;
  }

  get canvas() {
    return this.renderer.domElement;
  }

  dispose() {
    this.renderer.dispose();
  }

  render = (reason = "Unknown") => {

    this.verbose && console.debug(`Render [${reason}]`);

    const startTime = performance.now();

    this.scene.traverse((obj) => {
      obj.onBeforeRender(); 

      // Add Helpers
      obj.helpers.forEach(h => this.objectsHelpersGroup.add(h));
    });

    this.scene.threeObject.add(this.objectsHelpersGroup);

    // Add the cameraAnchor to the sceneHelpers for this viewport
    this.helpers.add(this.cameraFocusObject);

    // The viewport camera has a embedded light, useful to show 3D depth
    this.scene.threeObject.add(this.camera);

    // Render
    this.effectComposer.render();

    // Remove the cameraAnchor from the sceneHelpers as we can have multiple
    // viewport displaying the same scene from different points of view
    this.helpers.remove(this.cameraFocusObject);
    this.scene.threeObject.remove(this.camera);
    this.scene.threeObject.remove(this.objectsHelpersGroup);
    this.objectsHelpersGroup.clear();

    const endTime = performance.now();
    const frametime = endTime - startTime;

    this.signals.frameHasRendered.emit(frametime);
  }

}