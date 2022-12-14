// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 05/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import type {Editor} from '/editor/Editor';
import {Command} from '/commands/Command';
import type {EObject} from '/objects/EObject'

export class DeleteObjectsCommand extends Command {
  readonly name = "DeleteObjectsCommand";
  readonly isUndoable = true;
  private readonly objects: EObject[];
  private readonly removeChildren: boolean;
  private readonly oldParentsMap = new Map<EObject, EObject>();
  private readonly oldChildrenMap = new Map<EObject, Array<EObject>>();

  constructor(editor: Editor, objects : EObject[], removeChildren: boolean) {
    super(editor);
    this.objects = [...objects];
    this.removeChildren = removeChildren;

    for (const obj of objects) {
      if (obj.parent) {
        this.oldParentsMap.set(obj, obj.parent);
        this.oldChildrenMap.set(obj, [...obj.children]);
      } else {
        console.error(`Object ${obj.name} should have a parent.`);
      }
    }
  }

  async do() {  
    this.editor.remove(this.objects, this.removeChildren);
  }

  async undo() {
    for (const obj of this.objects) {
      const parent = this.oldParentsMap.get(obj);
      const children = this.oldChildrenMap.get(obj);

      if (parent) {

        if (!this.removeChildren && children) {
          obj.attach(children);
        } 

        this.editor.attach([obj], parent);

      } 
    }
  }

  async clean() {
    // Dispose of helpers
    for (const obj of this.objects) {
      for (const helper of obj.helpers) {
        helper.dispose();
      }
    }
  }
}