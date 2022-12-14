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

import type {Editor} from '/editor/Editor';
import {Command} from '/commands/Command';
import { EAnchor } from '/objects';

export class SetIKChainSizeCommand extends Command {
  readonly name = "SetIKChainSizeCommand";
  readonly isUndoable = true;
  private readonly anchor: EAnchor;
  private readonly newSize: number;
  private readonly oldSize: number;

  constructor(editor: Editor, anchor: EAnchor, size: number) {
    super(editor);
    if (!anchor.ikChain) {
      throw "Anchor has no chain attached";
    }
    this.anchor = anchor;
    this.newSize = size;
    this.oldSize = anchor.ikChain.size;
  }

  do(): void {
    this.editor.setIKChainSize(this.anchor, this.newSize);
  }
  
  undo(): void {
    this.editor.setIKChainSize(this.anchor, this.oldSize);
  }

  clean(): void {
    throw new Error('Method not implemented.');
  }
  
}