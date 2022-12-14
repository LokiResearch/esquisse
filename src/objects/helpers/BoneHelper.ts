// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 22/06/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {AxesHelper, BufferGeometry, ColorRepresentation, MeshStandardMaterialParameters} from 'three';
import { Bone, SphereGeometry, MeshStandardMaterial, Mesh,
CylinderGeometry, Quaternion, Vector3} from 'three';
import _default from 'ts-jest';
import { childrenBones, rootBone } from '/utils';
import { Helper } from './Helper';


const ikChainColors = [ 0xd7191c, 0xfdae61, 0xabdda4, 0x2b83ba ];



type OneMatMesh = Mesh<BufferGeometry, MeshStandardMaterial>;

const _sphereGeometry = new SphereGeometry(0.01);
const _quaternion = new Quaternion();
const UP_Y = new Vector3(0, 1, 0);
const _v = new Vector3();

const defaultBoneColor = 0x999999;

const boneMaterialDefaultParams : MeshStandardMaterialParameters = {
  color: defaultBoneColor,
  depthTest: false,
  depthWrite: false,
  transparent: true,
};

export class BoneHelper extends Mesh<BufferGeometry, MeshStandardMaterial> implements Helper {

  readonly bone: Bone;
  readonly isBoneHelper = true;
  // readonly sphere: Mesh;
  readonly cylinders = new Map<Bone, OneMatMesh>();
  canBeExported = false;
  type = "helper";
  private _showAxes = false;


  readonly axesHelper: AxesHelper;

  constructor(bone: Bone) {
    const ballMaterial = new MeshStandardMaterial(boneMaterialDefaultParams);

    super(_sphereGeometry, ballMaterial);
    this.bone = bone;
    this.name = bone.name+'-helper';
    this.renderOrder = 1;

    bone.updateMatrixWorld();
    bone.matrixWorld.decompose(
      this.position, this.quaternion, this.scale
    );
   
    this.axesHelper = new AxesHelper(0.05);
    this.axesHelper.renderOrder = 999;

    if (this._showAxes) {
      this.add(this.axesHelper);
    }

    if (Array.isArray(this.axesHelper.material)) {
      for(const m of this.axesHelper.material) {
        m.transparent = true;
        m.depthTest = false;
        m.depthWrite = false;
      }
    } else {
      const m = this.axesHelper.material;
      m.transparent = true;
      m.depthTest = false;
      m.depthWrite = false;
    }

    const children = childrenBones(this.bone);

    for (const child of children) {

      const distance = child.position.length();
      const cylinderGeometry = new CylinderGeometry(0.005, 0.005, distance);
      cylinderGeometry.translate(0, distance/2, 0);
      const cylinder = new Mesh(cylinderGeometry, new MeshStandardMaterial(
        boneMaterialDefaultParams
      ));
      _v.copy(child.position);
      _v.normalize();
      _quaternion.setFromUnitVectors(UP_Y, _v);
      cylinder.applyQuaternion(_quaternion);
      this.add(cylinder);
      this.cylinders.set(child, cylinder);
    }

  }

  update() {

    // Update position
    this.bone.updateMatrixWorld();
    this.bone.matrixWorld.decompose(
      this.position, this.quaternion, this.scale
    );

    // Update Materials

    this.setDefaultColor();
    if (this.bone.ik) {

      const root = rootBone(this.bone);
      const chains = this.bone.ik.chains;

      for (const chain of chains) {

        const color = ikChainColors[chain.id%ikChainColors.length];
        // If multiple chain, the ball color will be overwritten by the last 
        // chain, but since the last chain is last updated, it has priority
        // Otherwise, only draw if bone is not locked
        if (chain.tail !== this.bone || !chain.lockTail || chain.tail === root) {
          this.setBallColor(color);
        }

        // If not tail, then we can color the link with the child
        
        const child = chain.getChildForBone(this.bone);
        if (child) {
          this.setCylinderColorWithBone(color, child);
        }
      }
    }
  }

  dispose() {
    for (const [_, cylinder] of this.cylinders) {
      cylinder.geometry.dispose();
    }
  }

  set showAxes(value: boolean) {
    this._showAxes = value;
    if (value) {
      this.add(this.axesHelper);
    } else {
      this.axesHelper.removeFromParent();
    }
  }

  setDefaultColor() {
    this.setColor(defaultBoneColor);
  }

  setColor(color: ColorRepresentation) {
    this.setBallColor(color);
    this.setCylindersColor(color);
  }

  setBallColor(color: ColorRepresentation) {
    this.material.color.set(color);
  }

  setCylindersColor(color: ColorRepresentation) {
    for (const cylinder of this.cylinders.values()) {
      cylinder.material.color.set(color);
    }
  }

  setCylinderColorWithBone(color: ColorRepresentation, child: Bone) {
    const cylinder = this.cylinders.get(child);
    if (cylinder) {
      cylinder.material.color.set(color);
    }
  }

}

