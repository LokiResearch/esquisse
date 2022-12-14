// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 15/04/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import {MenuItem, TextField} from '@mui/material';
import {BaseControl, BaseControlProps} from './BaseControl';

const styles = {
  control: {
    margin: 0,
    padding: 0,
    width: '100%',
    maxWidth: '100%',
  }
};

export interface SelectOption<T> {
  value: T;
  label: string;
}

export interface SelectControlProps<T> extends BaseControlProps {
  value: T;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];
}

export const SelectControl = <T,>(props: SelectControlProps<T>) => {

  const {options, value, onChange, ...baseProps} = props;
  const disabled = props.disabled;
  const selectedOption = options.find(e => e.value === value);
  let index;
  if (!selectedOption) {
    index = 0;
    console.warn("Selected option not the props options.");
  } else {
    index = options.indexOf(selectedOption)
  }
  
  const onIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(event.target.value);
    onChange && onChange(options[idx].value);
  }

  return (
    <BaseControl
      labelPlacement="start"
      {...baseProps}
      control={
        <TextField
          disabled={disabled}
          sx={styles.control}
          margin="none"
          select
          size="small"
          variant="outlined"
          fullWidth
          inputProps= {{
            style: {
              fontSize: 13,
              textAlign: "center",
              paddingTop: "0.2em",
              paddingBottom: "0.2em",
              minWidth: '0em',
              maxWidth: '100%',
            },
          }}
          value={index}
          onChange={onIndexChange}
        >
          {
            options.map((option, idx) => (
              <MenuItem key={idx} value={idx}>
                {option.label}
              </MenuItem>
            ))
          }
        </TextField>
      }
    />
  );
}