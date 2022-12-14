/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Mon Sep 26 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { Command } from "..";
import { Editor } from "/editor/Editor";
import type { EAnchor, EAnchorShape } from "/objects";

export class SetAnchorShapeCommand extends Command {
  readonly name = "SetAnchorShapeCommand";
  readonly isUndoable = true;
  private oldShape: EAnchorShape;
  private newShape: EAnchorShape;
  private readonly anchor: EAnchor;

  constructor(editor: Editor, anchor: EAnchor, shape: EAnchorShape) {
    super(editor);
    this.anchor = anchor;
    this.oldShape = anchor.shape;
    this.newShape = shape;
  }
  
  do(): void {
    this.editor.setAnchorShape(this.anchor, this.newShape);
  }
  
  undo(): void {
    this.editor.setAnchorShape(this.anchor, this.oldShape);
  }
  
  clean(): void {}
}
