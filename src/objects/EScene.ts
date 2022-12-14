// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 12/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Scene, Color, Texture} from 'three';
import {EObject} from './EObject';
import { SceneIcon } from '/ui/Icons';


export class EScene extends EObject {

  declare readonly threeObject: Scene;
  readonly isScene = true;
  readonly type: string = "Scene";
  readonly shortText = "SCN";
  readonly icon = SceneIcon;
  isSelectable = false;
  isTransformable = false;
  canChangeParent = false;
  canBeDeleted = false;

  constructor(scene = new Scene()) {
    super(scene);
    this.name = "Scene";
  }

  get background() {
    return this.threeObject.background;
  }

  set background(color: Color | Texture | null) {
    this.threeObject.background = color;
  }

}