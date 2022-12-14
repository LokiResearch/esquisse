// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 09/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Object3D, Matrix4, Vector3} from 'three';
import './augments';
import {Signal} from 'typed-signals';
import {EMesh} from './mesh/EMesh';
import { Object3DIcon } from '/ui/Icons';
import { ESkinnedMesh } from './mesh/skinnedmesh/ESkinnedMesh';
import { Helper } from './helpers';

export class EObjectSignals {
  readonly objectsAdded = new Signal();
  readonly objectsRemoved = new Signal();
  readonly nameUpdated = new Signal();
  readonly selected = new Signal();
  readonly unselected = new Signal();
  readonly transformStarted = new Signal();
  readonly transformUpdated = new Signal();
  readonly transformEnded = new Signal();
  readonly helpersVisibilityChanged = new Signal();
}

export interface EObjectJsonData {
  showInExplorer: boolean;
  isSelectable: boolean;
  isTransformable: boolean;
  canChangeParent: boolean;
  canBeDeleted: boolean;
  type: string;
  uuid: string;
}

export abstract class EObject<T extends Object3D = Object3D> {
  readonly threeObject: T;
  abstract readonly type: string;
  abstract readonly shortText: string;
  readonly icon = Object3DIcon;

  readonly helpers = new Array<Object3D & Helper>();

  readonly signals = new EObjectSignals();
  
  /** Object used to transform this object when selected, default **this** */
  transformProxyObject: EObject;
  
  /** Flag used to update the helpers in the next rendered frame, *go 
   * back to false afterwards* */
  helpersNeedUpdate = false;

  /** Defines if the object can be selected in the scene */
  isSelectable = true;

  /** Defines if the object can be transformed in the scene */
  isTransformable = true;

  /** Defines if the object is displayed in the explorer list */
  showInExplorer = true;

  /** Defines if the object can change parent in the scene */
  canChangeParent = true;

  /** Defines if the object can receive children in the scene */
  canReceiveChildren = true;

  /** Tells if the object is currently selected in the scene */
  isSelected = false;
  
  canBeDeleted = true;

  canBeExported = true;

  constructor(threeObject: T) {
    this.threeObject = threeObject;
    this.threeObject.eObject = this as EObject;
    this.transformProxyObject = this as EObject;
  }

  toJson(): EObjectJsonData {
    return {
      uuid: this.uuid,
      type: this.type,
      isSelectable: this.isSelectable,
      isTransformable: this.isTransformable,
      showInExplorer: this.showInExplorer,
      canChangeParent: this.canChangeParent,
      canBeDeleted: this.canBeDeleted,
    }
  }

  fromJson(data: EObjectJsonData, _root: EObject): void {
    this.threeObject.uuid = data.uuid;
    this.isSelectable = data.isSelectable;
    this.isTransformable = data.isTransformable;
    this.showInExplorer = data.showInExplorer;
    this.canChangeParent = data.canChangeParent;
    this.canBeDeleted = data.canBeDeleted;
  }

  clone(recursive = false): this {
    return (new (this.constructor as any)).copy(this, recursive);
  }

  copy(source: this, recursive = false): this {
    // Disable recursion for three object as we handle it ourself
    this.threeObject.copy(source.threeObject, false);
    this.threeObject.eObject = this;

    if (recursive) {
      for (const child of source.children) {
        this.add(child.clone(recursive), false);
      }
    }

    this.canBeExported = source.canBeExported;
    this.isSelectable = source.isSelectable;
    this.isTransformable = source.isTransformable;
    this.showInExplorer = source.showInExplorer;
    this.canChangeParent = source.canChangeParent;
    this.isSelected = source.isSelected;

    return this;
  }

  add(objects: EObject | Array<EObject>, emitSignal = true) {
    if (!Array.isArray(objects)) {
      objects = [objects];
    }
    const addedObjects = new Array<EObject>();
    for (const obj of [...objects]) {
      if (obj.parent !== this) {
        this.threeObject.add(obj.threeObject);
        addedObjects.push(obj);
      }
    }
    if (emitSignal && addedObjects.length > 0) {
      this.signals.objectsAdded.emit(objects);
    }
  }

  remove(objects: EObject | Array<EObject>, emitSignal = true) {
    if (!Array.isArray(objects)) {
      objects = [objects];
    }
    const removedObjects = new Array<EObject>();
    for (const obj of [...objects]) {
      if (obj.parent === this) {
        this.threeObject.remove(obj.threeObject);
        removedObjects.push(obj);
      }
    }
    if (emitSignal && removedObjects.length > 0) {
      this.signals.objectsRemoved.emit(objects);
    }
  }

  attach(objects: EObject | Array<EObject>, emitSignal = true) {
    if (!Array.isArray(objects)) {
      objects = [objects];
    }
    const attachedObjects = new Array<EObject>();
    for (const obj of [...objects]) {
      if (obj.parent !== this) {
        this.threeObject.attach(obj.threeObject);
        attachedObjects.push(obj)
      }
    }
    if (emitSignal && attachedObjects.length > 0) {
      this.signals.objectsAdded.emit(objects);
    }
  }

  traverse(callback: (obj: EObject) => any) {
    this.threeObject.traverse(obj => {
      obj.eObject && callback(obj.eObject);
    });
  }

  setMatrix(matrix: Matrix4) {
    matrix.decompose(
      this.position,
      this.quaternion,
      this.scale
    );
    this.updateMatrixWorld(true);
  }

  onSelected() {
    this.isSelected = true;
    this.signals.selected.emit();
  }
  onUnselected() {
    this.isSelected = false;
    this.signals.unselected.emit();
  }

  onTransformStart() {
    this.signals.transformStarted.emit();
  }
  onTransformUpdate() {
    this.signals.transformUpdated.emit();
  }
  onTransformEnd() {
    this.signals.transformEnded.emit();
  }

  get parent() {
    return this.threeObject.parent?.eObject
  }

  get children() {
    return this.threeObject.children
      .filter(obj => obj.eObject !== undefined)
      .map(obj => obj.eObject!);
  }

  get threeChildren() {
    return this.threeObject.children;
  }

  listMeshes() {
    const array = new Array<EMesh>();
    this.traverse(obj => {
      if ((obj as EMesh).isMesh) {
        array.push(obj as EMesh);
      }
    });
    return array;
  }

  listSkinnedMeshes() {
    const array = new Array<ESkinnedMesh>();
    this.traverse(obj => {
      if ((obj as ESkinnedMesh).isSkinnedMesh) {
        array.push(obj as ESkinnedMesh);
      }
    })
    return array;
  }

  // Three Object getters
  get position() { return this.threeObject.position; }
  get quaternion() { return this.threeObject.quaternion; }
  get rotation() { return this.threeObject.rotation; }
  get scale() { return this.threeObject.scale; }
  get matrix() { return this.threeObject.matrix; }
  get matrixWorld() { return this.threeObject.matrixWorld; }
  // get type() { return this.threeObject.type; }
  
  
  get name() { return this.threeObject.name; }
  set name(name: string) {
    this.threeObject.name = name;
    this.signals.nameUpdated.emit();
  }


  get id() { return this.threeObject.id; }
  get uuid() { return this.threeObject.uuid; }

  lookAt(pos: Vector3) {
    return this.threeObject.lookAt(pos);
  }

  rotateOnAxis(axis: Vector3, angle: number) {
    return this.threeObject.rotateOnAxis(axis, angle);
  }

  worldToLocal(v: Vector3) {
    return this.threeObject.worldToLocal(v);
  }

  getWorldPosition(target: Vector3) {
    return this.threeObject.getWorldPosition(target);
  }

  getObjectById(id: number): EObject | undefined {
    return this.threeObject.getObjectById(id)?.eObject;
  }

  getObjectByUUID(uuid: string): EObject | undefined {
    let object;

    this.traverse(obj => {
      if (obj.uuid === uuid) {
        object = obj;
      }
    });
    return object;
  }

  clear() {
    this.threeObject.clear();
  }

  updateMatrix() {
    this.threeObject.updateMatrix();
  }

  // Bypass function
  updateMatrixWorld(force?: boolean) {
    this.threeObject.updateMatrixWorld(force);
  }

  removeFromParent() {
    this.threeObject.removeFromParent();
  }

  centerFromObjects(objects: Array<EObject>) {
    if (objects.length === 1) {
      this.setMatrix(objects[0].matrixWorld);
    } else if (objects.length > 1) {
      // If multiple objects are provided, don't apply scale or rotation as they
      // might differ between objects, just center the object in the world space
      this.scale.set(1, 1, 1);
      this.rotation.set(0, 0, 0);
      const objPos = new Vector3();
      this.position.set(0, 0, 0);
      for (const obj of objects) {
        this.position.add(obj.getWorldPosition(objPos));
      }
      this.position.divideScalar(objects.length);
      this.updateMatrixWorld(true);
    }
  }

  /**
   * Returns the distance in the hierarchy from this object to the given object
   * (i.e. nb of parents), returns -1 if object is not accessible from this object
   * @param object 
   */
  hierarchyDistanceTo(object: EObject): number {
    let cpt = 0;
    let parent: EObject | undefined = this as EObject;
    while (parent) {
      if (parent === object) {
        return cpt;
      }
      cpt++;
      parent = parent.parent;
    }
    return -1;
  }

  onBeforeRender() {
    // Update helpers if needed
    if(this.helpersNeedUpdate) {
      this.helpers.forEach(h => h.visible && h.update());
      this.helpersNeedUpdate = false;
    } 
  }

}
