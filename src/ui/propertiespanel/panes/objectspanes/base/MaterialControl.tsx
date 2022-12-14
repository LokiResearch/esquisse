// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 07/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import { Color, MeshStandardMaterial } from 'three';
import { StringControl, ColorControl } from '/ui/base/controls';
import { SetMaterialValuesCommand } from '/commands';
import { useEditorContext } from '/editor/Editor';
import { EMesh } from '/objects';
import {FlexRow} from '../../../../base/layout/FlexItems';

export interface MaterialControlProps {
  material: MeshStandardMaterial;
  mesh: EMesh;
}

export const MaterialControl = (props: MaterialControlProps) => {

  const {material, mesh} = props;
  const editor = useEditorContext();

  const onNameChanged = (name: string) => {
    const cmd = new SetMaterialValuesCommand(editor, mesh, material, {
      name: name
    });
    cmd.exec();
  }

  const onColorChanged = (color: string) => {
    const cmd = new SetMaterialValuesCommand(editor, mesh, material, {
      color: new Color(color),
    });
    cmd.exec();
  }

  return (
    <FlexRow>
      <StringControl 
        value={material.name} 
        onChange={onNameChanged}
      />
      <ColorControl 
        value={material.color.getHexString()}
        onChange={onColorChanged}
      />
    </FlexRow>
  );
}