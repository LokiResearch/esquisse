// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 16/03/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import * as React from 'react';
import { HelpersPane, MaterialListPane, ObjectNamePane, ObjectTRSPane, TrackingPane } from './base';
import { ESkinnedMesh } from '/objects';

export const SkinnedMeshPane = (props: {mesh: ESkinnedMesh}) => {

  const {mesh} = props;
  
  return (
    <>
      <ObjectNamePane object={mesh}/>
      <ObjectTRSPane object={mesh}/>
      <MaterialListPane mesh={mesh}/>
      <TrackingPane mesh={mesh}/>
      <HelpersPane object={mesh}/>
    </>
  );
  
}