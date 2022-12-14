// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 14/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import type {Editor} from '/editor/Editor';
import {Command} from '/commands/Command';
import type {EObject} from '/objects/EObject';

export class ClearSelectionCommand extends Command {
  readonly name = "ClearSelectionCommand";
  readonly isUndoable = true;
  private readonly lastSelection: EObject[];

  constructor(editor: Editor) {
    super(editor);
    this.lastSelection = [...this.editor.selectedObjects];
  }

  async do() {
    this.editor.unselectObjects(this.lastSelection);
  }

  async undo() {
    this.editor.selectObjects(this.lastSelection);
  }

  async clean() {

  }
}