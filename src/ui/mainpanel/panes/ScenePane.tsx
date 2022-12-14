// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 27/07/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import { useEditorContext } from '/editor/Editor';
import { AccordionView } from '../../base/views';
import { Box } from '@mui/material';
import { observer } from "mobx-react-lite"
import { BooleanSettingControl, ColorSettingControl, NumberSettingControl } from '/editor/EditorSettingsControl';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3em'
  }
}

export const ScenePane = observer(() => {

  const editor = useEditorContext();

  return (
    <Box sx={styles.root}>
      <AccordionView title="Grid">
        <NumberSettingControl setting={editor.settings.scene.grid.size}/>
        <ColorSettingControl setting={editor.settings.scene.grid.color}/>

      </AccordionView>
      
      <AccordionView title="Helpers">
        <BooleanSettingControl setting={editor.settings.objects.showBoxHelper}/>
        <BooleanSettingControl setting={editor.settings.objects.showSkeletonHelper}/>
        <BooleanSettingControl setting={editor.settings.objects.showFaceNormalsHelper}/>
      </AccordionView>
    </Box>
  );

});