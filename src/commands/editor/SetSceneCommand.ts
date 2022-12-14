// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 01/06/2021

// Loki, Inria project-team with Universit√© de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Universit√© de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Editor} from '/editor/Editor';
import {Command} from '/commands';
import {EScene} from '/objects';

export class SetSceneCommand extends Command {
  readonly name = "SetSceneCommand";
  readonly isUndoable = true;
  private readonly newScene: EScene;
  private readonly oldScene: EScene;

  // We need to save the list of old and new objects as when the scene changes,
  // parent of these object changes

  constructor(editor: Editor, scene: EScene) {
    super(editor);
    this.newScene = scene;
    this.oldScene = this.editor.scene;
  }

  async do() {
    this.editor.setScene(this.newScene);
  }

  async undo() {
    this.editor.setScene(this.oldScene);
  }

  async clean() {
    //do nothing
  }
  
}