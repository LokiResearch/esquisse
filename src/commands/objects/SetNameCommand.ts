// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 03/05/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Editor} from '/editor/Editor';
import {Command} from '/commands/Command';
import {EObject} from '/objects/EObject';

export class SetNameCommand extends Command {
  readonly name = "SetNameCommand";
  readonly isUndoable = true;
  private readonly object: EObject;
  private readonly oldName: string;
  private readonly newName: string;

  constructor(editor: Editor, object: EObject, name: string) {
    super(editor);
    this.object = object;
    this.oldName = object.name;
    this.newName = name;
  }

  async do() {
    this.object.name = this.newName;
  }

  async undo() {
    this.object.name = this.oldName;
  }

  async clean() {
    //do nothing
  }
}