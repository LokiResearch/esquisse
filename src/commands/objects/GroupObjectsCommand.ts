/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Tue Oct 11 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { Command } from "../Command";
import { CommandGroup } from "../CommandGroup";
import { AddObjectsCommand, SelectCommand } from "../editor";
import { SetParentCommand } from "./SetParentCommand";
import { Editor } from "/editor/Editor";
import { EGroup, EObject } from "/objects";

export class GroupObjectsCommand extends Command {
  readonly name = "GroupObjectsCommand";
  readonly isUndoable = true;
  private cmdsGroup?: CommandGroup;

  constructor(editor: Editor, objects: EObject[]) {
    super(editor);

    if (objects.length === 0) {
      return;
    }

    // Get the lowest hierarchical common parent of the objects to group
    let distance = Infinity;
    let groupParent;
    for (const obj of objects) {
      const parent = obj.parent;
      if (parent && parent.canReceiveChildren) {
        const d = parent.hierarchyDistanceTo(editor.scene);
        if (d !== -1 && d < distance) {
          groupParent = parent;
        }
      }
    }

    // 
    if (!groupParent) {
      console.error("Could not find a parent object to group, use scene instead.")
      groupParent = editor.scene;
    }

    const group = new EGroup();
    group.name = 'Group';

    const addCmd = new AddObjectsCommand(editor, group, groupParent);
    const parentCmd = new SetParentCommand(editor, group, objects);
    const selectCmd = new SelectCommand(editor, group, false);

    this.cmdsGroup = new CommandGroup(editor, [addCmd, parentCmd, selectCmd]);
  }

  async do() {
    this.cmdsGroup?.do();
  }

  async undo() {
    this.cmdsGroup?.undo();
  }

  async clean() {
    this.cmdsGroup?.clean();
  }


}