// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 26/04/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Vector2, PerspectiveCamera, Raycaster, Object3D} from 'three';
import {Operator} from './Operator';
import {SelectCommand, ClearSelectionCommand} from '/commands';
import {Editor} from '/editor/Editor';
import { ESkinnedMesh, EAnchor } from '/objects';

export class ViewportIKModeOperator extends Operator {
  readonly name = "ViewportIKModeOperator";
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
    const objects = new Array<Object3D>();
    this.editor.scene.traverse(obj => {
      if ((obj as ESkinnedMesh).isSkinnedMesh ||
          (obj as EAnchor).isAnchor) {
        objects.push(obj.threeObject);
      }
    });

    /**
     * If there is any SkinnedMesh of IKtarget to raycast on
     */
    if (objects.length > 0) {
      const raycaster = new Raycaster();
      raycaster.setFromCamera(this.clickPositionNDC, this.camera);

      const intersections = raycaster.intersectObjects(objects, true);
      
      /**
       * If we have hit any object
       */
      if (intersections.length > 0) {
        
        const {object: threeObject, point} = intersections[0];
        const object = threeObject.eObject;
        
        /**
         * Check we can get the ref to the esquisse object
         */
        if (object) {

          let anchor: EAnchor | null = null;

          /**
           * If hit object is Skinned Mesh and the skeleton has bones, then we
           * create an new anchor with a new chain if possible to the closest
           * bone
           */
          if ((object as ESkinnedMesh).isSkinnedMesh) {
            const mesh = object as ESkinnedMesh;
            const closestBone = mesh.skeleton.closestBoneFromPoint(point);

            if (closestBone) {

              // Make a temporary anchor
              anchor = new EAnchor(undefined, {temporary: true});
              
              this.editor.createIKChainForAnchor(anchor, closestBone.threeObject, 1);

              if (anchor.ikChain) {
                // Give the target the bone world position
                closestBone.getWorldPosition(anchor.position);
                anchor.updateMatrixWorld();

                // Make the skeleton visible
                this.editor.helpersManager.showSkeletonHelpers([mesh], true);
                this.editor.helpersManager.setHelpersNeedUpdateThree(anchor.ikChain.bones);
              } else {

                // In case there is no IKChain created, do nothing
                return;
              }
            }
          /**
           * If the hit object is an anchor, simply select it
           */
          } else if ((object as EAnchor).isAnchor) {
            anchor = object as EAnchor;
          }

          if (anchor) {
            const cmd = new SelectCommand(
              this.editor, anchor, this.multipleSelectionActive);
              cmd.exec();
          } 
          return;
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
