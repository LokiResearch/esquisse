// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 13/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Editor} from '/editor/Editor';
import {Command} from '/commands/Command';
import {EObject} from '/objects/EObject';

export class SetParentCommand extends Command {
  readonly name = "SetParentCommand";
  readonly isUndoable = true;
  private readonly oldParentMap = new Map<EObject, EObject>();
  private readonly newParent: EObject;
  private readonly objects = new Array<EObject>();

  constructor(editor: Editor, newParent: EObject, objects: Array<EObject>) {
    super(editor);
    this.newParent = newParent;

    for (const obj of objects) {

      if (!obj.parent) {
        console.warn("Can only change parent of objects with parents.");
      } else {

        const allChildren = new Array<EObject>();
        obj.traverse(o => allChildren.push(o));
  
        if (allChildren.includes(this.newParent)) {
        console.warn("Cannot set an object as a child of itself.");
        } else {
          this.oldParentMap.set(obj, obj.parent);
          this.objects.push(obj);
        } 
      }
    }
  }

  do() {
    this.editor.attach(this.objects, this.newParent);
  }

  undo() {
    for(const obj of this.objects) {
      const oldParent = this.oldParentMap.get(obj);
      if (oldParent) {
        this.editor.attach([obj], oldParent);
      } else {
        console.error("Object should have an old parent in the map", obj);
      }
    }
  }

  clean() {

  }

}