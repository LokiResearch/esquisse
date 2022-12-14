// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 25/07/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import { useEditorContext } from '/editor/Editor';
import { BooleanSettingControl } from '/editor/EditorSettingsControl';

export const SettingsPane = () => {

  const editor = useEditorContext();

  return (
    <>
      <BooleanSettingControl setting={editor.settings.verbose}/>
    </>
  );

}