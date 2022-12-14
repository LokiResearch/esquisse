// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 05/05/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import { Signal} from 'typed-signals';
import { Color, PerspectiveCamera, Bone, AmbientLight } from 'three';
import { EObject, EScene, EBone, ESkinnedMesh, 
  EGrid, EAnchor, EEmptyObject, EAmbientLight } from '/objects';
import { CommandManager } from './CommandManager';
import { EditorSettings } from './EditorSettings';
import { IKManager } from '/ik';
import { EditorShortcuts } from './EditorShortcuts';
import { HelpersManager } from './HelperManager';
import { TrackingManager } from '/tracking';
import { IKChain } from '../ik/IKChain';
import { Pose } from '@tensorflow-models/pose-detection';
import { applyPose, applyHandPose } from '/tracking/TrackingUtils';
import { Hand } from '@tensorflow-models/hand-pose-detection';
import { EAnchorShape } from '../objects/mesh/EAnchor';
import { autorun } from 'mobx';


export class Editor {

  readonly signals = {
    sceneChanged: new Signal(),
    sceneUpdated: new Signal<(reason: string)=>void>(),
    sceneGraphUpdated: new Signal<(reason: string)=>void>(),
    selectionChanged: new Signal(),
  };

  // Editor's modules
  readonly shortcuts = new EditorShortcuts(this);
  readonly settings = new EditorSettings(this);
  readonly command = new CommandManager();
  private readonly ik = new IKManager();
  readonly helpersManager = new HelpersManager(this);
  readonly tracking = new TrackingManager();

  // Editor's data
  scene = new EScene();
  readonly renderCamera = new PerspectiveCamera();

  readonly transformGroup = new EEmptyObject();
  readonly transformPivot = new EEmptyObject();
  readonly ambientLight = new EAmbientLight(new AmbientLight(0x999999));
  readonly grid = new EGrid();

  readonly selectedObjects = new Array<EObject>();

  constructor() {

    this.scene.name = "Scene";
    this.transformPivot.name = "Anchor";
    this.transformPivot.canBeExported = false;
    this.transformPivot.showInExplorer = false;
    this.transformGroup.name = "TransformGroup";
    this.transformGroup.canBeExported = false;
    this.transformGroup.showInExplorer = false;
    this.ambientLight.name = "AmbientLight";
    this.ambientLight.canBeExported = false;
    this.ambientLight.showInExplorer = false;
    this.grid.name = "Grid";
    this.grid.canBeExported = false;
    this.grid.isSelectable = false;
    this.grid.showInExplorer = false;

    this.addEditorObjects();
    this.setupSideEffects();
  }

  addEditorObjects() {
    this.scene.add(this.transformGroup, false);
    this.scene.add(this.transformPivot, false);
    this.scene.add(this.ambientLight, false);
    this.scene.add(this.grid, false);
  }

  private setupSideEffects() {

    // Suscribe to 
    autorun(() => {
      this.grid.setColor(this.settings.scene.grid.color.value);
      this.signals.sceneUpdated.emit("GridColorChanged");
    });

    autorun(() => {
      this.grid.setSize(this.settings.scene.grid.size.value);
      this.signals.sceneUpdated.emit("GridSizeChanged");
    })

    autorun(() => {
      this.scene.background = new Color(
        this.settings.theme.esquisse.background.scene);
      this.signals.sceneUpdated.emit("ThemeChanged");
    })

  }

  // #############################################################################
  //
  //                           Manipulating Objects Tree                  
  //
  // #############################################################################

  setScene(scene: EScene) {
    this.scene = scene;
    this.scene.background = new Color(
      this.settings.theme.esquisse.background.scene);
    this.addEditorObjects();
    this.changeIKChains();
    this.signals.sceneChanged.emit();
    this.signals.sceneGraphUpdated.emit('SceneChanged');
  }

  add(objects: EObject | EObject[], parent: EObject = this.scene) {
    objects = Array.isArray(objects) ? objects : [objects];
    parent.add(objects);
    this.helpersManager.objectsAdded(objects);
    this.signals.sceneGraphUpdated.emit("ObjectsAdded");
  }

  attach(objects: EObject | EObject[], parent: EObject = this.scene) {
    objects = Array.isArray(objects) ? objects : [objects];
    parent.attach(objects);
    this.helpersManager.objectsAttached(objects);
    this.signals.sceneGraphUpdated.emit("ObjectsAttached");
  }

  remove(objects: EObject | EObject[], removeChildren=true) {
    objects = Array.isArray(objects) ? objects : [objects];

    // Remove objects from their parent with(out) their chidlren
    for (const obj of objects) {
      if (!removeChildren && obj.parent) {
        obj.parent.attach(obj.children);
      }
      obj.removeFromParent();
    }

    // this.helpersManager.objectsRemoved(objects);
    this.signals.sceneGraphUpdated.emit("ObjectsRemoved");
  }

  // #############################################################################
  //
  //                            Objects Selection                  
  //
  // #############################################################################


  selectObjects(objects: Array<EObject>) {

    let selectionChanged = false;

    for (const obj of objects) {
      if (!this.selectedObjects.includes(obj)) {
        this.selectedObjects.push(obj);
        obj.onSelected();
        selectionChanged = true;
      }
    }
    
    if (selectionChanged) {
      this.updateTransformPivot();
      this.helpersManager.setHelpersNeedUpdate(objects);
      this.signals.selectionChanged.emit();
    }
  }

  unselectObjects(objects: Array<EObject>) {

    let selectionChanged = false;

    // Unselected currently selected objects
    for (const obj of objects) {
      if (this.selectedObjects.remove(obj)) {
        obj.onUnselected();
        selectionChanged = true;
      }

      // Delete ikmode temporary anchor
      const anchor = obj as EAnchor;
      if (anchor.isAnchor && anchor.isTemporary) {
        this.removeChainFromAnchor(anchor);
      }
    }

    if (selectionChanged) {
      this.updateTransformPivot();
      this.helpersManager.setHelpersNeedUpdate(objects);
      this.signals.selectionChanged.emit();
    }
  }

  // #############################################################################
  //
  //                            Objects Transform                  
  //
  // #############################################################################


  updateTransformPivot() {
    this.transformPivot.centerFromObjects(this.selectedObjects.map(o=>o.transformProxyObject));
  }

  transformObjectsStart(objects: Array<EObject>) {
    for (const obj of objects) {
      obj.onTransformStart();
    }
    this.helpersManager.setHelpersNeedUpdate(objects);
    this.signals.sceneUpdated.emit("ObjectsTransformStarted");
  }

  transformObjectsUpdate(objects: Array<EObject>) {

    for (const obj of objects) {
      obj.onTransformUpdate();
    }

    this.updateAnchorsChainForObjects(objects);
    this.helpersManager.setHelpersNeedUpdate(objects);
    this.signals.sceneUpdated.emit("ObjectsTransformUpdated");
  }

  
  transformObjectsEnd(objects: Array<EObject>) {


    for (const obj of objects) {
      obj.onTransformEnd();    
    }
    
    this.updateAnchorsChainForObjects(objects);
    this.updateSkinnedMeshesBoundingVolumes(objects);
  
    this.updateTransformPivot();

    this.helpersManager.setHelpersNeedUpdate(objects);
    this.signals.sceneUpdated.emit("ObjectsTransformEnded");
  }

  // #############################################################################
  //
  //                            Inverse Kinematics                  
  //
  // #############################################################################

  changeIKChains() {
    console.log("ChangeIkChains");

    // Removes chains from the ik manager
    this.ik.removeAllChains();

    // Add new chains
    this.scene.traverse(obj => {
      const anchor = obj as EAnchor;
      if (anchor.isAnchor && anchor.ikChain !== null) {
        console.log("Adding chain");
        this.ik.addChain(anchor.ikChain);
      }
    });
  }

  /**
   * Updates the skinned meshes bounding box found in the given object trees
   * @param objects Object trees to search skinned meshes from 
   */
  updateSkinnedMeshesBoundingVolumes(objects: EObject[]) {

    const rootBones = new Set<EBone>();

    for (const obj of objects) {

      // Traverse the object tree to find all the bone that could have moved
      // from an anchor movement
      obj.traverse(o => {
        const anchor = o as EAnchor;
        if (anchor.isAnchor && anchor.targetBone) {
          rootBones.add(anchor.targetBone.rootBone);
        }
      });

      const bone = obj as EBone;
      if (bone.isBone) {
        rootBones.add(bone.rootBone);
      }
    }

    if (rootBones.size > 0) {
    
      /**
       * Iterate over all the skinned meshes in the scene, find the ones with
       * a skeleton having a root bone present in the set of moved bones
       */
      this.scene.traverse(o => {

        const mesh = o as ESkinnedMesh;
        if (mesh.isSkinnedMesh) {
          for (const bone of mesh.skeleton.rootBones) {
            if (rootBones.has(bone)) {
              mesh.updateBoundingVolumes();
              this.helpersManager.setHelpersNeedUpdate(mesh);
            }
          }
          mesh.skeleton.rootBones
        }
      });

    }

  }

  /**
   * Update the ik chains of all the ik target found in the given object trees
   * @param objects 
   */
  updateAnchorsChainForObjects(objects: EObject[]) {

    const chainsToSolve = new Set<IKChain>();

    for (const obj of objects) {

      // Traverse the object tree to get all the IKtarget chains that need update
      obj.traverse((o => {
        const anchor = o as EAnchor;
        if (anchor.isAnchor && anchor.ikChain) {
          anchor.getWorldPosition(anchor.ikChain.target);
          chainsToSolve.add(anchor.ikChain);
          const tail = anchor.ikChain.tail.eObject;
          if (tail) {
            this.helpersManager.setHelpersNeedUpdate(tail);
          }
        }
      }))
    }

    this.ik.solveChains(chainsToSolve);

  }

  setIKChainSize(anchor: EAnchor, size: number) {
    const ikChain = anchor.ikChain;

    if(ikChain) {
      const oldTail = ikChain.tail;
      const oldSize = ikChain.size;
      const hasChanged = this.ik.setChainSize(ikChain, size);
      if(hasChanged) {
        const updateBone = oldSize < size ? ikChain.tail : oldTail;
        this.helpersManager.setHelpersNeedUpdateThree(updateBone);
        anchor.signals.ikDataUpdated.emit();
        this.signals.sceneUpdated.emit("IKChainSizeChanged");
      }
    }
  }

  createIKChainForAnchor(anchor: EAnchor, bone: Bone, size: number) {

    const chain = this.ik.createChainFromBone(bone, size);
    if (chain) {
      anchor.name = bone.name + '-' + "anchor";
      anchor.signals.nameUpdated.emit();
      this.helpersManager.setHelpersNeedUpdateThree(chain.tail);
      anchor.ikChain = chain;
      anchor.signals.ikDataUpdated.emit();
      this.signals.sceneUpdated.emit('AddedIKChain');
      return true;
    }
    return false;
  }

  removeChainFromAnchor(anchor: EAnchor) {
    const chain = anchor.ikChain;
    if (chain) {
      this.ik.removeChain(chain);
      this.helpersManager.setHelpersNeedUpdateThree(chain.tail);
      anchor.ikChain = null;
      anchor.signals.ikDataUpdated.emit();
      this.signals.sceneUpdated.emit('RemovedIKChain');
      return true;
    }
    return false;
  }

  makeAnchorNonTemporary(anchor: EAnchor) {
    anchor.setAsNonTemporary();
    this.add(anchor);
    this.signals.sceneGraphUpdated.emit('AnchorNonTemporary')
  }

  setAnchorShape(anchor: EAnchor, shape: EAnchorShape) {
    anchor.setShape(shape);
    this.signals.sceneUpdated.emit("AnchorShapeChanged");
  }

  updateIKTargetChain(anchor: EAnchor) {
    if (anchor.ikChain) {
      anchor.getWorldPosition(anchor.ikChain.target);
      this.helpersManager.setHelpersNeedUpdateThree(anchor.ikChain.tail);
    }
  }

  // #############################################################################
  //
  //                            Tensor Flow Pose                   
  //
  // #############################################################################

  applyPose(mesh: ESkinnedMesh, poses: Pose[]) {
    const needUpdate = applyPose(mesh.threeObject, poses);
    if (needUpdate) {
      const helpersToUpdate = [mesh, ...mesh.skeleton.rootBones];
      this.helpersManager.setHelpersNeedUpdate(helpersToUpdate);
      this.signals.sceneUpdated.emit("SkinnedMeshPoseUpdated");
    }
  }

  applyHandPose(mesh: ESkinnedMesh, hands: Hand[]) {
    const needUpdate = applyHandPose(this, mesh.threeObject, hands);
    if (needUpdate) {
      const helpersToUpdate = [mesh, ...mesh.skeleton.rootBones];
      this.helpersManager.setHelpersNeedUpdate(helpersToUpdate);
      this.signals.sceneUpdated.emit("SkinnedMeshHandPoseUpdated");
    }
  }


}

const EditorContext = React.createContext<Editor|null>(null);

export const EditorContextProvider = EditorContext.Provider;
export const useEditorContext = () => {
  const editor = React.useContext(EditorContext);
  if (!editor) {
    throw("useEditorContext is used outside of a provider.");
  }
  return editor;
}
