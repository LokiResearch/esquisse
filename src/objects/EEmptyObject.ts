// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 09/20/2022

import { Object3D } from "three";
import { EObject } from "./EObject";

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

export class EEmptyObject extends EObject<Object3D> {

  readonly type: string = "Object";
  readonly shortText: string = "OBJ";
  readonly isEmpty = true;

  constructor (object: Object3D = new Object3D()) {
    super(object);
  }
}