// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 09/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import { EObject, EScreen, EMesh, ESkinnedMesh,
  EBone, EGroup, EAnchor, EBasicMesh} from '/objects';
import {ScreenPane} from './objectspanes/ScreenPane';
import {MeshPane} from './objectspanes/MeshPane';
import {SkinnedMeshPane} from './objectspanes/SkinnedMeshPane';
import {BonePane} from './objectspanes/BonePane';
import {GroupPane} from './objectspanes/GroupPane';
import { AnchorPane } from './objectspanes/AnchorPane';
import { BaseObjectPane } from './objectspanes/BaseObjectPane';
import { Box } from '@mui/material';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3em',
  }
}

interface ObjectInfoPaneProps {
  objects: EObject[],
}

export const ObjectInfoPane = (props: ObjectInfoPaneProps) => {

  const {objects} = props;
    
  if (objects.length === 0) {
    return <></>;
  }

  const object = objects[0];

  let children;
  if ((object as EScreen).isScreen) {
    children = <ScreenPane screen={object as EScreen}/>;
  } else if ((object as ESkinnedMesh).isSkinnedMesh) {
    children = <SkinnedMeshPane mesh={object as ESkinnedMesh}/>;
  } else if ((object as EAnchor).isAnchor) {
    children = <AnchorPane anchor={object as EAnchor}/>;
  } else if ((object as EBasicMesh).isBasicMesh) {
    children = <MeshPane mesh={object as EMesh}/>;
  } else if ((object as EBone).isBone) {
    children = <BonePane bone={object as EBone}/>;
  } else if ((object as EGroup).isGroup) {
    children = <GroupPane group={object as EGroup}/>;
  } else {
    children = <BaseObjectPane object={object}/>
  }

  return (
    <Box sx={styles.root}>
      {children}
    </Box>
  );
}