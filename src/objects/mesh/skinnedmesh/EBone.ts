// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 09/11/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import { Bone } from 'three';
import { EObject } from '../../EObject';
import { BoneHelper } from '../../helpers/BoneHelper';
import { IKChain } from '/ik';
import { BoneIcon } from '/ui/Icons';

export class EBone extends EObject<Bone> {

  readonly isBone = true;
  readonly type: string = "Bone";
  readonly shortText = "BNE";
  readonly icon = BoneIcon;

  /**
   * The ikChains the bone belongs to
   */
  ikChains = new Array<IKChain>();
  isIKLocked = false;
  helper?: BoneHelper;
  canChangeParent = false;
  canReceiveChildren = false;
  canBeDeleted = false;
  
  constructor(bone = new Bone()) {
    super(bone);

    if (this.isRootBone) {
      this.isIKLocked = true;
    }
  }

  /** */
  showBoneHelper(visibility: boolean) {
    if (!this.helper) {
      this.helper = new BoneHelper(this.threeObject);
      this.helpers.push(this.helper);
    }
    this.helper.visible = visibility;
  }

  get ik() {
    return this.threeObject.ik;
  }

  get childrenBones() {
    return this.children.filter(c => (c as EBone).isBone) as EBone[];
  }

  get parentBone() {
    if (this.parent && (this.parent as EBone).isBone) {
      return this.parent as EBone;
    }
    return null;
  }

  get isRootBone() {
    return this.parentBone === null;
  }

  get rootBone() {
    let root = this as EBone;
    while (root.parent && (root.parent as EBone).isBone) {
      root = root.parent as EBone;
    }

    return root;
  }
}