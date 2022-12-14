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

export class CommandGroup extends Command {
  readonly name = "CommandGroup";
  readonly isUndoable = true;

  private readonly commands;

  constructor(editor: Editor, commands: Command[]) {
    super(editor);
    this.commands = [...commands];
  }

  async do() {
    // Do the commands in the given order
    for (let i=0; i<this.commands.length; i++) {
      this.commands[i].do();
    }
  }

  async undo() {
    // Undo the commands in the reverse order
    for (let i=this.commands.length-1; i>0; i--) {
      this.commands[i].undo();
    }
  }

  clean() {
    //do nothing
  }
}