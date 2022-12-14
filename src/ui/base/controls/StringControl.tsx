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
import {OutlinedInput} from '@mui/material';
import {BaseControl, BaseControlProps} from './BaseControl';

const styles = {
  control: {
    margin: 0,
    padding: 0,
    width: '100%',
    maxWidth: '100%',
  }
};

export interface StringControlProps extends BaseControlProps {
  value: string;
  onChange?: (value: string) => void;
}

export const StringControl = (props: StringControlProps) => {

  const {value, onChange, ...baseProps} = props;
  const disabled = props.disabled;

  const [str, setStr] = React.useState(value);
  const [oldStr, setOldStr] = React.useState(value);

  /**
   * We need to use useEffect to update state on prop changes
   */
  React.useEffect(() => {
    if (value !== str) {
      setStr(value);
    }
  }, [value])

  const onTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStr(event.target.value);
  }

  const onTextValidated = () => {
    setOldStr(str);
    onChange && onChange(str);
  }

  const onTextCanceled = () => {
    setStr(oldStr);
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onTextValidated();
    } else if (event.key === 'Escape') {
      onTextCanceled();
    }
  }

  return (
    <BaseControl 
      labelPlacement="start"
      {...baseProps}
      control={        
        <OutlinedInput
          disabled={disabled}
          sx={styles.control}
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
          value={str}
          onChange={onTextChanged}
          onBlur={onTextValidated}
          onKeyDown={onKeyDown}
        />
      }
    />
  );
}