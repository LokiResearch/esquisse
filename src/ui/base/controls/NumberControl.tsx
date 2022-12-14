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
import {IconButton, OutlinedInput} from '@mui/material';
import {BaseControl, BaseControlProps} from './BaseControl';
import {PlusIcon, MinusIcon} from '/ui/Icons';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  control: {
    margin: 0,
    padding: 0,
    maxWidth: '6em',
  },
  buttons: {
    minWidth: 0,
    minHeight: 0,
    margin: 0,
    padding: 0,
    background: 'action.hover'
  },
  buttonIcons: {
    width: '0.7em',
    height: '0.7em',    
  },
  input: {
    fontSize: 13,
    textAlign: "center",
    paddingTop: "0.2em",
    paddingBottom: "0.2em",
    minWidth: '0em',
    maxWidth: '100%',
  }
};

export interface NumberBaseControlProps {
  step?: number;
  decimals?: number;
  limits?: {min: number, max: number};
}

export interface NumberControlProps extends BaseControlProps, NumberBaseControlProps {
  value: number;
  onChange?: (value: number) => void;
  /** If true, number field cannot be written */
  readonly?: boolean;
  /** Called on plus button click, if true is returned, number is increased by step */
  canIncrease?: (value: number, step: number) => boolean;
  /** Called on minys button click, if true is returned, number is decreased by step */
  canDecrease?: (value: number, step: number) => boolean;

}

export const NumberControl = (props: NumberControlProps) => {
  
  const {readonly, value, canIncrease, canDecrease, onChange, 
    step = 1, decimals = 2, limits, ...baseProps} = props;
  const disabled = props.disabled;

  const [num, setNum] = React.useState(String(value.toFixed(decimals)));
  const [oldNum, setOldNum] = React.useState(String(value.toFixed(decimals)));

  /**
   * We need to use useEffect to update state on prop change
   */
  React.useEffect(() => {
    setNum(String(value.toFixed(decimals)));
  }, [value])
  
  const onMinusClick = () => {
    const n = Number(num);
    if (!canDecrease || canDecrease(n, step)) {
      onChange && onChange(n-step);
    }
  }

  const onPlusClick = () => {
    const n = Number(num);
    if(!canIncrease || canIncrease(n, step)) {
      onChange && onChange(n+step);
    }
  }

  const onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {

    const s = e.target.value;
    // Let the user types negative numbers and clean the field
    if (s === "-" || s=== "" || !Number.isNaN(Number(s))) {
      setNum(s);
    } 
  }

  const onTextCanceled = () => {
    setNum(oldNum);
  }

  const onTextValidated = () => {
    const n = Number(num);
    const newNum = checkLimits(n, limits);
    const str = String(newNum.toFixed(decimals));
    setNum(str);
    setOldNum(str);
    onChange && onChange(newNum);
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onTextValidated();
    } else if (e.key === 'Escape') {
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
          readOnly={readonly}
          sx={styles.control}
          fullWidth
          inputProps= {{sx: styles.input}}
          startAdornment={
            <IconButton sx={styles.buttons} size="small" color="primary" 
              onClick={onMinusClick} disabled={disabled}>
              <MinusIcon sx={styles.buttonIcons}/>
            </IconButton>
          }
          endAdornment={
            <IconButton sx={styles.buttons} size="small" color="primary"
              onClick={onPlusClick} disabled={disabled}>
              <PlusIcon sx={styles.buttonIcons}/>
            </IconButton>
          }
          value={num}
          onChange={onTextChanged}
          onBlur={onTextValidated}
          onKeyDown={onKeyDown}
        />
      }
    />
  );
}

function checkLimits(n: number, limits?: {min: number, max: number}): number {
  if (limits) {
    return Math.min(limits.max, Math.max(limits.min, n));
  }
  return n;
}
