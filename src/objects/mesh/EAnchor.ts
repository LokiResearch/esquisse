/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Mon Sep 26 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { EBone, EMesh, EMeshBase, EMeshJsonData, EMeshSignals} from '.';
import { IKTargetIcon } from '/ui/Icons';
import { BoxGeometry, BufferGeometry, CircleGeometry, SphereGeometry } from 'three';
import { IKChain } from '/ik';
import { Signal } from 'typed-signals';
import { EObject } from '../EObject';

const _noShapeGeometry = new BufferGeometry();
const _sphereGeometry = new SphereGeometry(0.01);
const _boxGeometry = new BoxGeometry(0.01, 0.01, 0.01);
const _circleGeometry = new CircleGeometry(0.01, 20);

export enum EAnchorShape {
  NoShape = "No Shape",
  Sphere = "Sphere",
  Box = "Box",
  Circle = "Circle"
}

export class EAnchorSignals extends EMeshSignals {
  ikDataUpdated = new Signal();
}

export interface EAnchorJsonData extends EMeshJsonData {
  isTemporary: boolean;
  shape: EAnchorShape;
  ikChain?: {
    size: number;
    effectorUUID: string;
    id: number;
  }
}

export class EAnchor extends EMesh {

  readonly type: string = "Anchor";
  readonly isAnchor = true;
  readonly shortText = "ACR";
  readonly icon = IKTargetIcon;
  readonly signals = new EAnchorSignals();
  ikChain: IKChain | null = null;
  private _shape = EAnchorShape.NoShape;
  private _isTemporary: boolean;

  constructor(mesh = new EMeshBase(), options = {temporary: false}) {
    super(mesh);
    this._isTemporary = options.temporary;
  }

  toJson(): EAnchorJsonData {
    const data = super.toJson();

    let chainData = undefined;
    if (this.ikChain) {
      chainData = {
        size: this.ikChain.size,
        effectorUUID: this.ikChain.head.uuid,
        id: this.ikChain.id,
      }
    }

    return {
      ...data,
      isTemporary: this.isTemporary,
      shape: this.shape,
      ikChain: chainData,
    }
  }

  fromJson(data: EAnchorJsonData, root: EObject): void {
    super.fromJson(data, root);
    this._isTemporary = data.isTemporary;
    this._shape = data.shape;

    /** Recreate the ik chain */
    if (data.ikChain) {
      const bone = root.getObjectByUUID(data.ikChain.effectorUUID) as EBone;
      if (bone && bone.isBone) {
        this.ikChain = new IKChain(data.ikChain.id, bone.threeObject, data.ikChain.size);
      } else {
        throw `Couldn't find a Bone with uuid ${data.ikChain.effectorUUID}`;
      }
    }
  }
  
  get targetBone() {
    if (this.ikChain) {
      return this.ikChain.head.eObject as EBone;
    }
    return null;
  }

  get isTemporary() {
    return this._isTemporary;
  }

  setAsNonTemporary() {
    if (this._isTemporary) {
      this._isTemporary = false;
      this.setShape(EAnchorShape.Sphere);
    }
  }

  get shape() {
    return this._shape;
  }

  setShape(shape: EAnchorShape) {

    this._shape = shape;
    switch (shape) {
      case EAnchorShape.Sphere:
        this.threeObject.geometry = _sphereGeometry;
        break;
      case EAnchorShape.Circle:
        this.threeObject.geometry = _circleGeometry;
        break;
      case EAnchorShape.Box:
        this.threeObject.geometry = _boxGeometry;
        break;
      default:
      case EAnchorShape.NoShape:
        this.threeObject.geometry = _noShapeGeometry;
        break;
    }
    this.signals.ikDataUpdated.emit();
  }
}
