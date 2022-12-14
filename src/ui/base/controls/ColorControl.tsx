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
import { Input, Box }from '@mui/material';
import { BaseControl, BaseControlProps } from './BaseControl';

const styles = {
  colorBox: {
    border: 'solid 1px',
    borderColor: 'action.disabled',
    borderRadius: '4px',
    width: 30,
    height: 18,
    backgroundColor: 'black'
  },
  input: {
    visibility: 'hidden',
  }
};

export interface ColorControlProps extends BaseControlProps {
  value: string;
  onChange?: (value: string) => void;
}

/**
 * A color control component (controlled)
 * @param props 
 * @returns 
 */
export const ColorControl = (props: ColorControlProps) => {

  const {value, onChange, ...baseProps} = props;
  const disabled = props.disabled;

  const onColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event.target.value);
  };

  const hexColor = toHex(value);
  const opacity = disabled ? 0.3 : 1;

  return (
    <BaseControl 
      labelPlacement='start'
      {...baseProps}
      control={
        <Box sx={{...styles.colorBox, backgroundColor: hexColor, opacity: opacity}}>
          <Input
            disabled={disabled}
            sx={styles.input}
            type="color"
            onChange={onColorChange}
            value={hexColor}
          />
        </Box>
      }
    />
  );
}

function toHex(str: string) {
  return str.startsWith('#') ? str : "#"+str;
}