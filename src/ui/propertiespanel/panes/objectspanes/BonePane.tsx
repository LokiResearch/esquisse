// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 16/03/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import { HelpersPane, ObjectNamePane, ObjectTRSPane } from './base';
import {EBone} from '/objects';

export const BonePane = (props: {bone: EBone}) => {

  const {bone} = props;
  
  return (
    <>
      <ObjectNamePane object={bone}/>
      <ObjectTRSPane object={bone}/>
      <HelpersPane object={bone}/>
    </>
  );
  
}