/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Wed Sep 28 2022
 *
 * Loki, Inria project-team with Universit√© de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Universit√© de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { IKBoneData } from './IKChain';

declare module 'three/src/objects/Bone' {
  export interface Bone {
    ik?: IKBoneData;
  }
}

