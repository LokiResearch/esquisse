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

import { Bone } from "three";
import { Command } from "../Command";
import { Editor } from "/editor/Editor";
import { EAnchor } from "/objects";

export class AddIKChainCommand extends Command {
  readonly name = "AddIkChainCommand";
  readonly isUndoable = true;

  private readonly anchor: EAnchor;
  private chainSize: number;
  private chainHead: Bone;

  constructor(editor: Editor, anchor: EAnchor, chainSize: number, effector: Bone) {
    super(editor);
    this.anchor = anchor;
    if (this.anchor.ikChain) {
      throw 'Anchor already has a chain attached';
    }

    this.chainHead = effector;
    this.chainSize = chainSize;
  }

  do(): void {
    this.editor.createIKChainForAnchor(this.anchor, this.chainHead, this.chainSize);
  }

  undo(): void {
    this.editor.removeChainFromAnchor(this.anchor);
  }

  clean(): void {}
}