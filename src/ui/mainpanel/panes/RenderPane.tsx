// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 05/07/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import { Box, Button } from '@mui/material';
import { RenderOperator } from '/operators/RenderOperator';
import { ActivableAccordionView, AccordionView } from '../../base/views';
import { useEditorContext } from '/editor/Editor';
import { observer } from 'mobx-react-lite';
import { BooleanSettingControl, ColorSettingControl, NumberSettingControl } from '/editor/EditorSettingsControl';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3em'
  }
};

export const RenderPane = () => {

  const editor = useEditorContext();

  const onRenderButtonClick = () => {
    const op = new RenderOperator(editor);
    op.exec();
  }

  return (
    <Box sx={styles.root}>

      <FillsOptions/>
      <VisibleContoursOptions/>
      <HiddenContoursOptions/>
      <CameraOptions/>
      <DebugOptions/>

      <Button variant="outlined" fullWidth onClick={onRenderButtonClick}>
        Render
      </Button>

    </Box>
  );
}

const FillsOptions = observer(() => {

  const editor = useEditorContext();
  const fills = editor.settings.svg.fills;

  return (
    <ActivableAccordionView controlProps={fills.draw}>
      <BooleanSettingControl setting={fills.drawInterfaces}/>
    </ActivableAccordionView>
  );
});


const VisibleContoursOptions = observer(() => {
  
  const editor = useEditorContext();
  const contours = editor.settings.svg.visibleContours;

  return (
    <ActivableAccordionView controlProps={contours.draw}>
      <NumberSettingControl setting={contours.width}/>
      <ColorSettingControl setting={contours.color}/>
      <ActivableAccordionView controlProps={contours.dash.useDashStyle} elevation={5}>
        <NumberSettingControl setting={contours.dash.holeLength}/>
        <NumberSettingControl setting={contours.dash.solidLength}/>
      </ActivableAccordionView>
    </ActivableAccordionView>
  );
});


const HiddenContoursOptions = observer(() => {
  
  const editor = useEditorContext();
  const options = editor.settings.svg.hiddenContours;

  return (
    <ActivableAccordionView controlProps={options.draw}>
      <NumberSettingControl setting={options.width}/>
      <ColorSettingControl setting={options.color}/>
      <ActivableAccordionView controlProps={options.dash.useDashStyle} elevation={5}>
        <NumberSettingControl setting={options.dash.holeLength}/>
        <NumberSettingControl setting={options.dash.solidLength}/>
      </ActivableAccordionView>
    </ActivableAccordionView>
  );
});

const CameraOptions = observer(() => {
  return (
    <AccordionView title="Camera">
    </AccordionView>
  );
});

/**
 * Debug render options component
 * @returns 
 */
const DebugOptions = observer(() => {

  const editor = useEditorContext();
  const debug = editor.settings.svg.debug;
  const singOptions = debug.singularityPoints;
  const contOptions = debug.contours;
  const fillsOptions = debug.fills;
  
  return (
    <AccordionView title="Debug">
      <BooleanSettingControl setting={debug.prettifySVG}/>
      <BooleanSettingControl setting={debug.ignoreContoursVisibility}/>

      <AccordionView title="Fills" elevation={5}>
        <BooleanSettingControl setting={fillsOptions.useRandomColors}/>
        <BooleanSettingControl setting={fillsOptions.drawPolygonIds}/>
        <BooleanSettingControl setting={fillsOptions.drawPolygonRaycastPoints}/>
      </AccordionView>

      <AccordionView title="Contours" elevation={5}>
        <BooleanSettingControl setting={contOptions.drawContoursRaycastPoints}/>
        <BooleanSettingControl setting={contOptions.useRandomColors}/>
      </AccordionView>

      <ActivableAccordionView controlProps={debug.singularityPoints.draw} elevation={5}>
        <NumberSettingControl setting={singOptions.size}/>
        <BooleanSettingControl setting={singOptions.drawLegend}/>
        <BooleanSettingControl setting={singOptions.drawVisiblePoints}/>
        <BooleanSettingControl setting={singOptions.drawHiddenPoints}/>
      </ActivableAccordionView>

    </AccordionView>
  );
});