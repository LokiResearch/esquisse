// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 17/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {SpotLight, SpotLightHelper} from 'three';
import {ELight} from './ELight';

export class ESpotLight extends ELight<SpotLight, SpotLightHelper> {

  readonly isSpotLight = true;
  readonly type: string = "SpotLight";

  constructor(light = new SpotLight()) {
    super(light);
  }
}