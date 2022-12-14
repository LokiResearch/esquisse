// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 01/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Editor} from '/editor/Editor';
import {Command} from '/commands';
import {EScene} from '/objects';
// import {EObject} from '/objects/EObject';

export class SetSceneCommand extends Command {
  readonly name = "SetSceneCommand";
  readonly isUndoable = true;
  private readonly newScene: EScene;
  private readonly oldScene: EScene;
  // private readonly newChildren: Array<EObject>;
  // private readonly oldChildren: Array<EObject>;

  // We need to save the list of old and new objects as when the scene changes,
  // parent of these object changes

  constructor(editor: Editor, scene: EScene) {
    super(editor);
    this.newScene = scene;
    // this.newChildren = [...this.newScene.children];
    this.oldScene = this.editor.scene;
    // this.oldChildren = [...this.oldScene.children];
  }

  async do() {
    // this.editor.setScene(this.newScene, this.newChildren);
    this.editor.setScene(this.newScene);
  }

  async undo() {
    // this.editor.setScene(this.oldScene, this.oldChildren);
    this.editor.setScene(this.oldScene);
  }

  async clean() {

  }
  
}

// export class SetSceneCommand extends Command {
//   readonly name = "SetSceneCommand";
//   readonly isUndoable = true;
//   private readonly newScene: EScene;
//   private readonly oldScene: EScene;
//   private readonly newChildren: Array<EObject>;
//   private readonly oldChildren: Array<EObject>;

//   // We need to save the list of old and new objects as when the scene changes,
//   // parent of these object changes

//   constructor(editor: Editor, scene: EScene) {
//     super(editor);
//     this.newScene = scene;
//     this.newChildren = [...this.newScene.children];
//     this.oldScene = this.editor.scene;
//     this.oldChildren = [...this.oldScene.children];
//   }

//   async do() {
//     this.editor.setScene(this.newScene, this.newChildren);
//   }

//   async undo() {
//     this.editor.setScene(this.oldScene, this.oldChildren);
//   }

//   async clean() {

//   }
  
// }