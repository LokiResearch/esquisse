// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 31/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import {BaseControl, BaseControlProps} from './BaseControl';
import {Checkbox} from '@mui/material';

const styles = {
  control: {
    "& .MuiFormControlLabel-label": {
      with: '10em',
    },
  },
  checkbox: {
    margin: 0,
    padding: 0,
  }
};

export interface BooleanControlProps extends BaseControlProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}

/**
 * A boolean control component (controlled)
 * @param props 
 * @returns 
 */
export const BooleanControl = (props: BooleanControlProps) => {

  const {value, disabled, onChange, ...baseProps} = props;

  const onValueChange = (_event: React.SyntheticEvent, checked: boolean) => {
    props.onChange && props.onChange(checked);
  }

  return (
    <BaseControl 
      labelPlacement="end"
      {...baseProps}
      control={
        <Checkbox 
          disabled={disabled}
          sx={styles.checkbox}
          checked={value} 
          onChange={onValueChange}
        />
      }
    />
  );
}