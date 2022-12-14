/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Fri Oct 07 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { Bone } from "three";
import { Command } from "..";
import { Editor } from "/editor/Editor";
import type { EAnchor } from "/objects";

export class RemoveIKChainCommand extends Command {
  readonly name = "RemoveIKChainCommand";
  readonly isUndoable = true;

  private readonly anchor: EAnchor;
  private chainSize: number;
  private chainHead: Bone;

  constructor(editor: Editor, anchor: EAnchor) {
    super(editor);
    this.anchor = anchor;
    if (!this.anchor.ikChain) {
      throw 'Anchor has no chain to remove';
    }

    this.chainSize = this.anchor.ikChain.size;
    this.chainHead = this.anchor.ikChain.head;
  }
  
  do(): void {
    this.editor.removeChainFromAnchor(this.anchor);
  }
  
  undo(): void {
    this.editor.createIKChainForAnchor(this.anchor, this.chainHead, this.chainSize);
  }
  
  clean(): void {
    //do nothing
  }
}
