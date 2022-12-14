// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 14/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Command} from '/commands/Command';
import {EObject} from '/objects/EObject';
import {Editor} from '/editor/Editor';


export class SelectCommand extends Command {
  readonly name = "SelectCommand";
  readonly isUndoable = false;
  private readonly multipleSelectionActive: boolean;
  private readonly selection: Array<EObject>;
  private readonly lastSelection: Array<EObject>;

  constructor(
      editor: Editor,
      selection: EObject | Array<EObject>,
      multipleSelectionActive: boolean
    ) {
    super(editor);

    if (Array.isArray(selection)) {
      this.selection = [...selection];
    } else {
      this.selection = [selection];
    }
    this.multipleSelectionActive = multipleSelectionActive;
    this.lastSelection = [...this.editor.selectedObjects];
  }

  async do() {
    if (this.multipleSelectionActive) {

      // Already selected objects go unselected in multi selection mode
      const selectedObjects = new Array<EObject>();
      const unselectedObjects = new Array<EObject>();

      for (const obj of this.selection) {
        if (this.editor.selectedObjects.includes(obj)) {
          unselectedObjects.push(obj);
        } else {
          selectedObjects.push(obj);
        }
      }

      this.editor.unselectObjects(unselectedObjects);
      this.editor.selectObjects(selectedObjects);

    } else {
      this.editor.unselectObjects(this.lastSelection);
      this.editor.selectObjects(this.selection);
    }
  }

  async undo() {
    this.editor.unselectObjects(this.selection);
    this.editor.selectObjects(this.lastSelection);
  }

  async clean() {

  }
}