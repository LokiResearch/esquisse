// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 11/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {PointLight, PointLightHelper} from 'three';
import {ELight} from './ELight';

export class EPointLight extends ELight<PointLight, PointLightHelper> {

  readonly isPointLight = true;
  readonly type = "PointLight";

  constructor(light = new PointLight()) {
    super(light);
  }
}