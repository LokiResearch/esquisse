// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 10/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { Mesh, BufferGeometry, MeshStandardMaterial, Color} from 'three';
import {EObject, EObjectSignals, EObjectJsonData} from '..';
import {Signal} from 'typed-signals';
import { BoxHelper } from '../helpers/BoxHelper';

export type EMeshBase = 
  Mesh<BufferGeometry, MeshStandardMaterial | MeshStandardMaterial[]>;
export const EMeshBase = 
  Mesh<BufferGeometry, MeshStandardMaterial | MeshStandardMaterial[]>;

export class EMeshSignals extends EObjectSignals {
  readonly materialChanged = new Signal();
}

export type EMeshJsonData = EObjectJsonData

export abstract class EMesh <T extends  EMeshBase = EMeshBase> 
  extends EObject<T> {

  static defaultColor = new Color(0x777777);

  readonly signals = new EMeshSignals();
  readonly isMesh = true;
  boxHelper?: BoxHelper;

  constructor(mesh: T) {
    super(mesh);

    // Init some material properties
    const mats = Array.isArray(this.material) ? this.material : [this.material];

    let materialNamePrefix = mesh.name;
    if (materialNamePrefix !== "") {
      materialNamePrefix += '-';
    }

    let i=0;
    for (const mat of mats) {
      i++;
      mat.flatShading = true;
      mat.metalness = 0;
      mat.roughness = 0;
      mat.needsUpdate = true;

      if (mat.name === "") {
        mat.name = materialNamePrefix+'material' + (mats.length > 1 ? i : "")
      }

    }
  }

  showBoxHelper(visibility: boolean) {
    if (!this.boxHelper) {
      this.boxHelper = new BoxHelper(this.threeObject);
      this.helpers.push(this.boxHelper);
    }
    this.boxHelper.visible = visibility;
    this.signals.helpersVisibilityChanged.emit();
  }

  get material() { return this.threeObject.material; }
  get firstMaterial() {
    return Array.isArray(this.material) ? this.material[0] : this.material;
  }
  get geometry() { return this.threeObject.geometry; }

}