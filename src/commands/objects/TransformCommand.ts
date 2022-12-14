// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 01/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Editor} from '/editor/Editor';
import {Matrix4, Vector3} from 'three';
import {Command} from '/commands/Command';
import {EObject} from '/objects/EObject';

const _vec = new Vector3();

export class TransformCommand extends Command {
  readonly name = "TransformCommand";
  readonly isUndoable = true;

  private readonly pivotStartMatrix = new Matrix4();
  private readonly pivotEndMatrix = new Matrix4();
  private readonly objects = Array<EObject>();
  private readonly objectsStartMatrices = new Array<Matrix4>();
  private readonly parents = new Array<EObject | undefined>();

  constructor(
      editor: Editor,
      objects : Array<EObject>,
      initialMatrix: Matrix4) {
    super(editor);

    // Remove skinned meshes as they can only be moved through their skeleton
    for(const obj of objects) {
      if (obj.isTransformable) {
        this.objects.push(obj.transformProxyObject);
      }
    }

    this.pivotStartMatrix.copy(initialMatrix);
    this.pivotEndMatrix.copy(initialMatrix);

    for (const obj of this.objects) {
      this.parents.push(obj.parent);
      this.objectsStartMatrices.push(obj.matrix.clone());
    }

    this.editor.transformGroup.setMatrix(this.pivotStartMatrix);
  }

  attachObjects() {
    for (const obj of this.objects) {
      this.editor.transformGroup.attach(obj, false);
    }
  }

  detachObjects()  {
    // Put back the objects in their respective parents
    for (let i=0; i<this.objects.length; i++) {
      const parent = this.parents[i];
      if (parent) {
        parent.attach(this.objects[i]);
      } else {
        // As the object had no parent, remove it from the transform group,
        // but set its position as its current world position in the group, so
        // stays where it currently is
        this.objects[i].getWorldPosition(_vec);
        this.objects[i].removeFromParent();
        this.objects[i].position.copy(_vec);
      }
    }
  }

  move() {
    if (this.objects.length > 0) {
      this.attachObjects();
      this.editor.transformGroup.setMatrix(this.pivotEndMatrix);
      this.detachObjects();
    }
  }

  update(pivotEndMatrix: Matrix4) {
    this.pivotEndMatrix.copy(pivotEndMatrix);
    this.move();
    this.editor.transformObjectsUpdate(this.objects);
  }

  async do() {
    this.editor.transformObjectsStart(this.objects);
    this.move();
    this.editor.transformObjectsEnd(this.objects);
  }

  async undo() {
    this.editor.transformObjectsStart(this.objects);
    for (let i=0; i<this.objects.length; i++) {
      this.objects[i].setMatrix(this.objectsStartMatrices[i]);
    }
    this.editor.transformObjectsEnd(this.objects);
  }

  async redo() {
    this.editor.transformGroup.setMatrix(this.pivotStartMatrix);
    // this.editor.transformObjectsStart(this.objects);
    this.do();
  }

  async clean() {}
}