// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 01/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Editor} from '/editor/Editor';

export abstract class Command {

  abstract readonly name: string;
  abstract readonly isUndoable: boolean;

  protected readonly editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  abstract do(): void;
  abstract undo(): void;
  abstract clean(): void;

  exec() {
    this.editor.command.executeCommand(this);
  }  
}