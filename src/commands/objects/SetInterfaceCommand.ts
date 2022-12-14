// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 15/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Editor} from '/editor/Editor';
import {MeshStandardMaterial, Texture} from 'three';
import {Command} from '/commands';
import {EScreen} from '/objects';

export class SetInterfaceCommand extends Command {

  readonly name = "SetInterfaceCommand";
  readonly isUndoable = true;
  private readonly screen: EScreen;
  private readonly material: MeshStandardMaterial;
  private readonly lastTexture: Texture | null;
  private readonly texture: Texture | null;
  // private readonly lastColor: string;
  private isDone = false;
  // private readonly lastTransparent: boolean;

  constructor(editor: Editor, screen: EScreen, texture: Texture | null) {
    super(editor);
    this.screen = screen;
    this.material = screen.firstMaterial;
    this.lastTexture = this.material.map;
    // this.lastColor = "#"+this.material.color.getHexString();
    // this.lastTransparent = this.material.transparent;
    this.texture = texture;
  }

  async do() {
    this.material.map = this.texture;
    // this.material.color.set("#FFFFFF");
    // this.material.transparent = true;
    // this.material.alphaTest = 0.5;
    this.material.needsUpdate = true;
    this.screen.signals.interfaceChanged.emit();
    this.editor.signals.sceneUpdated.emit("New interface");
    this.isDone = true;
  }

  async undo() {
    this.material.map = this.lastTexture;
    // this.material.color.set(this.lastColor);
    // this.material.transparent = this.lastTransparent;
    this.material.needsUpdate = true;
    this.screen.signals.interfaceChanged.emit();
    this.editor.signals.sceneUpdated.emit("New interface");
    this.isDone = false;
  }

  async clean() {
    if (this.isDone) {
      this.lastTexture?.dispose();
    } else {
      this.texture?.dispose();
    }
  }

}