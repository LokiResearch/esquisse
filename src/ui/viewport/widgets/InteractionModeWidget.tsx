// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 25/04/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import {Paper, ToggleButton, ToggleButtonGroup, styled, Tooltip, PaperProps
  } from '@mui/material';
import {PoseModeIcon, BoneModeIcon, ObjectModeIcon} from '/ui/Icons';
import {InteractionMode} from '../Viewport';

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

interface InteractionModeWidgetProps extends PaperProps {
  mode: InteractionMode;
  onModeChange?: ((mode: InteractionMode) => void);
}


export const InteractionModeWidget = (props: InteractionModeWidgetProps) => {

  const {mode, onModeChange, ...otherProps} = props;

  const onChange = React.useCallback((_: React.MouseEvent, value: string | null) => {
    if (value) {
      const mode = value as InteractionMode;
      onModeChange && onModeChange(mode);
    }
  }, []);

  return (
    <StyledPaper {...otherProps} elevation={1}>
      <StyledToggleButtonGroup exclusive value={mode}  onChange={onChange}>

        <ToggleButton value={InteractionMode.Object} aria-label="object mode">
          <Tooltip title='Set the viewport to object mode'>
            <ObjectModeIcon fontSize="small"/>
          </Tooltip>
        </ToggleButton>

        <ToggleButton value={InteractionMode.Bone} aria-label="object mode">
          <Tooltip title='Set the viewport to object mode'>
            <BoneModeIcon fontSize="small"/>
          </Tooltip>
        </ToggleButton>

        <ToggleButton value={InteractionMode.Pose} aria-label="pose mode">
          <Tooltip title='Set the viewport to pose mode'>
            <PoseModeIcon fontSize="small"/>
          </Tooltip>
        </ToggleButton>

      </StyledToggleButtonGroup>

    </StyledPaper>
  );
}

