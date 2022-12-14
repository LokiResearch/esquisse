// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 26/04/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { Vector2, PerspectiveCamera, Raycaster } from 'three';
import { ESkinnedMesh } from '/objects';
import { Operator } from './Operator';
import { SelectCommand, ClearSelectionCommand } from '/commands';
import { Editor } from '/editor/Editor';

export class ViewportBoneModeOperator extends Operator {
  readonly name = "ViewportBoneModeOperator";
  private readonly clickPositionNDC: Vector2;
  private readonly camera: PerspectiveCamera;
  private readonly multipleSelectionActive: boolean;

  constructor(
      editor: Editor,
      event: PointerEvent,
      viewport: HTMLElement,
      camera: PerspectiveCamera) {
    super(editor);
    
    this.clickPositionNDC = new Vector2(
      (event.offsetX / viewport.clientWidth) * 2 - 1,
      -(event.offsetY / viewport.clientHeight) * 2 + 1
    );
    this.camera = camera;
    this.multipleSelectionActive = event.shiftKey;
  }

  exec() {
    const objects = new Array<ESkinnedMesh>();
    this.editor.scene.traverse(obj => {
      const sm = obj as ESkinnedMesh;
      sm.isSkinnedMesh && objects.push(sm);
    })

    if (objects.length > 0) {
      const raycaster = new Raycaster();
      const threeObjects = objects.map(obj => obj.threeObject);
      raycaster.setFromCamera(this.clickPositionNDC, this.camera);

      const intersections = raycaster.intersectObjects(threeObjects, true);
      if (intersections.length > 0) {
        const hitObject = intersections[0].object;
        if (hitObject.eObject) {
          const hitPoint = intersections[0].point;
          const skinnedMesh = hitObject.eObject as ESkinnedMesh;
          const skeleton = skinnedMesh.skeleton;
          const closestBone = skeleton.closestBoneFromPoint(hitPoint);

          if (closestBone) {

            // Make the skeleton visible
            this.editor.helpersManager.showSkeletonHelpers([skinnedMesh], true);

            const cmd = new SelectCommand(
              this.editor, closestBone, this.multipleSelectionActive);
            cmd.exec();
            return;
          }
        }
      }
    }

    // If no object have been selected and there are current selected objects
    if (this.editor.selectedObjects.length > 0) {
      const cmd = new ClearSelectionCommand(this.editor);
      cmd.exec();
    }
  }
}
