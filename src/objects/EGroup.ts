// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 10/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { Group } from 'three';
import { EObject } from './EObject';
import { GroupIcon } from '/ui/Icons';

export class EGroup extends EObject<Group> {

  readonly isGroup = true;
  readonly type: string = "Group";
  readonly icon = GroupIcon;
  readonly shortText = "GRP";

  constructor(group = new Group()) {
    super(group);
  }
}