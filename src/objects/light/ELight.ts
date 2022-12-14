// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 10/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Light, Object3D} from 'three';
import {EObject} from '../EObject';


export abstract class ELight<T extends Light, H extends Object3D> extends EObject<T> {

  readonly isLight = true;
  readonly shortText = "LHT";
  helper?: H;

  constructor(light: T) {
    super(light);
  }
}