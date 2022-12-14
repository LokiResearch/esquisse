// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 30/06/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import { Object3D } from "three";
import { Editor } from "./Editor";
import { EObject, EBone, EMesh, ESkinnedMesh } from "/objects";

export class HelpersManager {

  readonly editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  objectsAdded(objects: Array<EObject>) {

    const settings = this.editor.settings.objects;

    const meshes = new Array<EMesh>();
    const skMeshes = new Array<ESkinnedMesh>();

    for (const obj of objects) {
      // Traverse the hierarchy of added objects
      obj.traverse(subObj => {

        const mesh = subObj as EMesh;
        mesh.isMesh && meshes.push(mesh);

        const skMesh = subObj as ESkinnedMesh;
        skMesh.isSkinnedMesh && skMeshes.push(skMesh);

      });
    }

    if (settings.showBoxHelper.value) {
      this.showBoxHelpers(meshes, true);
    }
    
    if (settings.showFaceNormalsHelper.value) {
      this.showFaceNormalsHelpers(meshes, true);
    }

    if (settings.showSkeletonHelper.value) {
      this.showSkeletonHelpers(skMeshes, true);
    }
  } 

  objectsAttached(objects: Array<EObject>) {
    this.objectsAdded(objects);
  }

  setHelpersNeedUpdate(objects: EObject | EObject[]) {

    if (!Array.isArray(objects)) {
      objects = [objects];
    }

    for (const object of objects) {
      object.traverse((obj: EObject) => {
        obj.helpersNeedUpdate = true;
      });
    }
  }

  setHelpersNeedUpdateThree(objects: Object3D | Object3D[]) {

    if (!Array.isArray(objects)) {
      objects = [objects];
    }

    for (const object of objects) {
      object.traverse((obj: Object3D) => {
        if (obj.eObject) {
          obj.eObject.helpersNeedUpdate = true;
        }
      });
    }
  }

  showFaceNormalsHelpers(_meshes: EMesh[], _visibility: boolean) {
    console.warn("FaceNormalsHelpers not implemented");
  }

  showBoxHelpers(meshes: EMesh[], visibility: boolean) {

    for (const mesh of meshes) {
      mesh.showBoxHelper(visibility);
    }
    this.editor.signals.sceneUpdated.emit('ShowBoxHelpers');
  }

  
  private showBoneHelper(bone: EBone, visibility: boolean, showChildren = true) {

    bone.showBoneHelper(visibility);

    if (showChildren) {
      for (const child of bone.childrenBones) {
        this.showBoneHelper(child, visibility);
      }
    }
  }

  showSkeletonHelpers(objects: (ESkinnedMesh | EBone)[], visibility: boolean) {
    
    let needsUpdate = false;
    for (const obj of objects) {
      const bone = obj as EBone;
      if (bone.isBone) {
        this.showBoneHelper(bone.rootBone, visibility);
        needsUpdate = true;
      } else {
        const mesh = obj as ESkinnedMesh;
        for (const bone of mesh.skeleton.bones) {
          if (bone.isRootBone) {
            this.showBoneHelper(bone, visibility);
            needsUpdate = true;
          }
        }
      }
    }

    needsUpdate && this.editor.signals.sceneUpdated.emit('ShowSkeletonHelpers');
  }
}
