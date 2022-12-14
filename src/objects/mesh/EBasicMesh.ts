/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Wed Sep 28 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { EMesh } from ".";
import { MeshIcon } from '/ui/Icons';

export class EBasicMesh extends EMesh {
  readonly type: string = "Mesh";
  readonly shortText: string = "MSH";
  readonly isBasicMesh = true;
  readonly icon = MeshIcon;
}