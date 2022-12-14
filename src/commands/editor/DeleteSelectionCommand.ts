// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 20/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Command} from '../Command';
import {Editor} from '/editor/Editor';
import {ClearSelectionCommand, DeleteObjectsCommand, CommandGroup } from '..';

export class DeleteSelectionCommand extends Command {
  readonly name = "DeleteSelectionCommand"
  readonly isUndoable = true;

  private readonly cmdGroup;

  constructor(editor: Editor, clearHierarchy = true) {
    super(editor);

    const selectedObjects = [...this.editor.selectedObjects];

    const clearCmd = new ClearSelectionCommand(editor);
    const deleteCmd = new DeleteObjectsCommand(editor, selectedObjects, clearHierarchy);
    this.cmdGroup = new CommandGroup(editor, [clearCmd, deleteCmd]);
  }

  async do() {
    this.cmdGroup.do();
  }

  async undo() {
    this.cmdGroup.undo();
  }

  async clean() {
    //do nothing
  }

}