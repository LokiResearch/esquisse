// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 31/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import * as React from 'react';
import {FormControlLabel, Typography, Box, Tooltip, styled, SvgIcon, 
  TypographyProps} from '@mui/material';

const styles = {
  labelContent: {
    display: 'flex',
  },
  control: {
    pointerEvents: 'auto',
    paddingRight: '0.1em',
    paddingLeft: '0.1em'
  },
  icon: {
    fontSize: '1.5em',
    paddingRight: '0.3em'
  },
};

type MuiColor = 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success';

interface BaseControlCommonProps {
  tooltip?: string;
  label?: string;
  icon?: typeof SvgIcon;
  disabled?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  labelPlacement?: 'start' | 'end' | 'bottom' | 'top';
  iconColor?: MuiColor;
  typographyProps?: TypographyProps;
}

export interface BaseControlProps extends BaseControlCommonProps {
  tooltip?: string;
  label?: string;
  icon?: typeof SvgIcon;
  disabled?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  labelPlacement?: 'start' | 'end' | 'bottom' | 'top';
  iconColor?: MuiColor;
  typographyProps?: TypographyProps;
}

interface BaseControlInternalProps extends BaseControlCommonProps {
  control: React.ReactNode;
}

export const BaseControl = (props: BaseControlInternalProps) => {

  const {tooltip, label, control, icon: Icon, typographyProps, iconColor,
    ...otherProps} = props;

  return (
    <Tooltip title={tooltip ?? ""}>
      <StyledFormControlLabel
        {...otherProps}
        control={
          <Box sx={styles.control} onClick={props.onClick}>
            {control}
          </Box>
        }
        label={
          <Box sx={styles.labelContent}>
            {Icon && <Icon sx={styles.icon} color={iconColor}/>}
            <Typography {...typographyProps}>
              {label}
            </Typography>
          </Box>
        }
      />  
    </Tooltip>
  );
}

const StyledFormControlLabel = styled(FormControlLabel)({
  justifyContent: 'start',
  margin: 0,
  pointerEvents: 'none',
  "& .MuiFormControlLabel-label": {
    pointerEvents: 'none',
  },
});