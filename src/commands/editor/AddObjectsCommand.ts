// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 01/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import type {Editor} from '/editor/Editor';
import {Command} from '..';
import type {EObject} from '/objects';

export class AddObjectsCommand extends Command {
  readonly name = "AddObjectsCommand";
  readonly isUndoable = true;
  private readonly objects: EObject[];
  private readonly parent: EObject;

  constructor(editor: Editor, objects: EObject | EObject[], parent?: EObject) {
    super(editor);
    if (Array.isArray(objects)) {
      this.objects = objects;
    } else {
      this.objects = [objects];
    }

    this.parent = parent ?? editor.scene;
  }

  async do() {  
    this.editor.add(this.objects, this.parent);
  }

  async undo() {
    this.editor.remove(this.objects);
  }

  async clean() {
    //do nothing
  }
}