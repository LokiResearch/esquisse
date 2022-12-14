// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 18/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import {Paper, Divider, ToggleButton, ToggleButtonGroup, styled, Tooltip,
  PaperProps} from '@mui/material';
import {TranslateModeIcon, RotateModeIcon, ScaleModeIcon, GlobalTransformIcon
} from '/ui/Icons';
import {TransformSpace, TransformMode} from '../Viewport';

const VerticalDivider = styled(Divider)(({theme}) => ({
  margin:'0.4em',
  paddingTop:'1.2em',
  background: theme.palette.action.active,
}));

const StyledPaper = styled(Paper)({
  display: 'flex',
  flexWrap: 'wrap',
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
  "& .MuiToggleButtonGroup-grouped": {
    width: '2.2em',
    height: '2.2em',
    margin: theme.spacing(0.3),
    border: 'none',

    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));


export interface TransformControlsWidgetProps extends 
  PaperProps, TransformModeControlProps, TransformSpaceControlProps {}

export const TransformControlsWidget = (props: TransformControlsWidgetProps) => {

  const {mode, onModeChange, space, onSpaceChange, ...otherProps} = props;

  return (
    <StyledPaper {...otherProps} elevation={1}>
      
      <TransformModeControl mode={mode} onModeChange={onModeChange}/>
      <VerticalDivider orientation="vertical" flexItem/>
      <TransformSpaceControl space={space} onSpaceChange={onSpaceChange}/>
 
    </StyledPaper>
  );
}


interface TransformModeControlProps {
  mode: TransformMode;
  onModeChange?: ((mode: TransformMode) => void);
}

const TransformModeControl = React.memo((props: TransformModeControlProps) => {

  const {mode, onModeChange} = props;

  const onChange = (_: React.MouseEvent, value: string | null) => {
    if (value) {
      onModeChange && onModeChange(value as TransformMode);
    }
  }

  return (
    <StyledToggleButtonGroup exclusive value={mode} onChange={onChange}>
        
      <ToggleButton value={TransformMode.Translate} aria-label="translate">
        <Tooltip title='Set the object transformation to "translate"'>
          <TranslateModeIcon fontSize="small"/>
        </Tooltip>
      </ToggleButton>

      <ToggleButton value={TransformMode.Rotate} aria-label="rotate">
        <Tooltip title='Set the object transformation to "rotate"'>
          <RotateModeIcon fontSize="small"/>
        </Tooltip>
      </ToggleButton>

      <ToggleButton value={TransformMode.Scale} aria-label="scale">
        <Tooltip title='Set the object transformation to "scale"'>
          <ScaleModeIcon fontSize="small"/>
        </Tooltip>
      </ToggleButton>
      
    </StyledToggleButtonGroup>
  );
});

interface TransformSpaceControlProps {
  space: TransformSpace;
  onSpaceChange?: ((mode: TransformSpace) => void);
}

const TransformSpaceControl = React.memo((props: TransformSpaceControlProps)=>{

  const {space, onSpaceChange} = props;

  const onChange = (_: React.MouseEvent, values: string[] | null) => {
    if (values) {
      const set = new Set(values);
      const value = set.has(TransformSpace.Global) ? TransformSpace.Global : TransformSpace.Local;
      onSpaceChange && onSpaceChange(value);
    }
  }

  let value = [];
  let tooltip = TransformSpace.Global;
  if (space === TransformSpace.Global) {
    tooltip = TransformSpace.Local;
    value.push(TransformSpace.Global);
  }

  return (
    <StyledToggleButtonGroup size="small" value={value} onChange={onChange}>
      
      <ToggleButton value={TransformSpace.Global} aria-label="global">
        <Tooltip title={`Set the object transformation space to "${tooltip}"`}>
          <GlobalTransformIcon fontSize="small"/>
        </Tooltip>
      </ToggleButton>

    </StyledToggleButtonGroup>

  );


});

