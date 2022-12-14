// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 14/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { DoubleSide, ShaderChunk} from 'three';
import { EMesh, EMeshBase, EMeshJsonData, EMeshSignals, MeshFactory, MeshType } from '.';
import { Signal} from 'typed-signals';
import { ScreenIcon } from '/ui/Icons';
import { EObject } from '../EObject';

/**
 * Copy of the MeshStandardMaterial fragment shader, where the final diffuse
 * color transparency channel is replaced by the material color.
 * 
 * See https://stackoverflow.com/questions/12368200/displaying-background-colour-through-transparent-png-on-material
 */
const _BlendTextureFragment = ShaderChunk.meshphysical_frag.replace(
  '#include <map_fragment>',
  ShaderChunk.map_fragment.replace(
    `diffuseColor *= sampledDiffuseColor;`,
    `diffuseColor = vec4( mix( diffuse, sampledDiffuseColor.rgb, sampledDiffuseColor.a ), opacity );`
));

/**
 * Copy of the MeshStandardMaterial fragment shader, where the material color 
 * uniformm is ignored and set to white so that the displayed texture has no
 * color distorsions.
 */
const _WhiteDiffuseFragment = ShaderChunk.meshphysical_frag.replace(
  `vec4 diffuseColor = vec4( diffuse, opacity );`,
  `vec4 diffuseColor = vec4( 1, 1, 1, opacity );`
)

export class EScreenSignals extends EMeshSignals {
  interfaceChanged = new Signal();
}

export interface EScreenJsonData extends EMeshJsonData {
  useTransparentTexture: boolean;
  texture?: {
    name: string;
    url: string;
  }
}

export class EScreen extends EMesh {

  readonly isScreen = true;
  readonly signals = new EScreenSignals();
  readonly icon = ScreenIcon;
  readonly type = "Screen";
  readonly shortText = "SCR";
  private _useTransparentTexture = false;

  hasInterface = false;
  
  toJson(): EScreenJsonData {
    const data = super.toJson();
    let texture;

    if (this.texture) {
      texture = {
        name: this.texture.name,
        url: this.texture.sourceFile,
      };
    }

    return {
      ...data,
      texture: texture,
      useTransparentTexture: this._useTransparentTexture
    }
  }

  get texture() {
    return this.firstMaterial.map;
  }

  fromJson(data: EScreenJsonData, root: EObject): void {
    super.fromJson(data, root);
    if (data.texture) {
      if (this.texture) {
        this.texture.name = data.texture.name;
        this.texture.sourceFile = data.texture.url;
      } else {
        throw 'Screen Object should have a texture.';
      }
    }
    this.setUseTransparentTexture(data.useTransparentTexture);
  }

  constructor(plane?: EMeshBase) {
    if(!plane) {
      plane = MeshFactory.getStandardMesh(MeshType.PLANE, {side: DoubleSide});
    }
    super(plane);
    this.name = "Screen";

    this.setUseTransparentTexture(this._useTransparentTexture);
  }

  get useTransparentTexture() {return this._useTransparentTexture}

  setUseTransparentTexture(value: boolean) {
    this._useTransparentTexture = value;

    if ( value) {
      // Use the default fragment
      this.firstMaterial.transparent = true;
      this.firstMaterial.onBeforeCompile = (shader) => {
        shader.fragmentShader = _WhiteDiffuseFragment;
      };
 
    } else {
      // Use the blend texture fragment
      this.firstMaterial.transparent = false;
      this.firstMaterial.onBeforeCompile = (shader) => {
        shader.fragmentShader = _BlendTextureFragment;
      }
    }

    this.firstMaterial.needsUpdate = true;
    this.signals.interfaceChanged.emit();
  }
}