// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 21/10/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {EObject} from '/objects/EObject';

declare module 'three/src/core/Object3D' {

  export interface Object3D {
    eObject?: EObject;
  }
}