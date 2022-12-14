// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 09/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Color, MeshStandardMaterial} from 'three';
import {Command} from '/commands/Command';
import {Editor} from '/editor/Editor';
import { EMesh } from '/objects';


interface MaterialSupportedChangeValue {
  color?: Color,
  name?: string;
}

export class SetMaterialValuesCommand extends Command {
  readonly name = "SetMaterialCommand";
  readonly isUndoable = true;
  private readonly mesh: EMesh;
  private readonly material: MeshStandardMaterial;
  private readonly oldValues: MaterialSupportedChangeValue;
  private readonly newValues: MaterialSupportedChangeValue;

  constructor(
      editor: Editor,
      mesh: EMesh,
      material: MeshStandardMaterial,
      values: MaterialSupportedChangeValue = {}
  ) {
    super(editor);
    this.mesh = mesh;
    this.material = material;
    this.newValues = values;
    this.oldValues = {...material};
  }

  async do() {
    this.material.setValues(this.newValues);
    this.material.needsUpdate = true;
    this.mesh.signals.materialChanged.emit();
    this.editor.signals.sceneUpdated.emit('MaterialUpdated');
  }

  async undo() {
    this.material.setValues(this.oldValues);
    this.material.needsUpdate = true;
    this.mesh.signals.materialChanged.emit();
    this.editor.signals.sceneUpdated.emit('MaterialUpdated');
  }

  async clean() {
    //do nothing
  }

}