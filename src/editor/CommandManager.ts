// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 17/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Command} from '/commands/Command';

export class CommandManager {

  readonly undoHistory = new Array<Command>();
  readonly redoHistory = new Array<Command>();
  
  executeCommand(cmd: Command) {
    cmd.do();
    if (cmd.isUndoable) {
      this.undoHistory.push(cmd);
      this.clearRedoHistory();
    }
  }

  undo() {
    const cmd = this.undoHistory.pop();
    if (cmd) {
      console.info("Undo: "+cmd.name);
      cmd.undo();
      this.redoHistory.push(cmd);
    }
  }

  redo() {
    const cmd = this.redoHistory.pop();
    if (cmd) {
      console.info("Redo: "+cmd.name);
      cmd.do();
      this.undoHistory.push(cmd);
    }
  }

  private clearRedoHistory() {
    for (const redoCmd of this.redoHistory) {
      redoCmd.clean();
    }
    this.redoHistory.clear();
  }

  private clearUndoHistory() {
    for (const undoCmd of this.undoHistory) {
      undoCmd.clean();
    }
    this.undoHistory.clear();
  }

  clearHistory() {
    this.clearUndoHistory();
    this.clearRedoHistory();
  }
}