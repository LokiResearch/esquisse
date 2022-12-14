/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Thu Oct 13 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { AmbientLight, Color, Object3D } from "three";
import { ELight } from "./ELight";

export class EAmbientLight extends ELight<AmbientLight, Object3D> {

  readonly isAmbientLight = true;
  readonly type = "EAmbientLight";

  constructor(light = new AmbientLight) {
    super(light);
  }

  get color() {return this.threeObject.color}
  set color (color: Color) {this.threeObject.color = color}

  get intensity() {return this.threeObject.intensity}
  set intensity (value: number) {this.threeObject.intensity = value}

}