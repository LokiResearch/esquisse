// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 31/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { observer } from 'mobx-react-lite';
import React from 'react';
import {BaseControl, BaseControlProps} from './BaseControl';
import {NumberControl, NumberBaseControlProps, NumberControlProps} from './NumberControl';
import {FlexRow} from '../layout/FlexItems';

export interface Vec3 {
  x: number, y: number, z: number
}

export interface Vec3ControlProps extends BaseControlProps, NumberBaseControlProps {
  value: Vec3;
  onChange: (value: Partial<Vec3>) => void; 
}


export const Vec3Control = (props: Vec3ControlProps) => {

  const {value, step, decimals, limits, onChange, ...baseProps} = props;
  const disabled = props.disabled;

  const controlProps = {
    step: step, decimals: decimals, limits: limits, disabled: disabled
  };

  const onXChange = React.useCallback((value: number) => {
    onChange({x: value});
  }, [onChange]);

  const onYChange = React.useCallback((value: number) => {
    onChange({y: value});
  }, [onChange]);

  const onZChange = React.useCallback((value: number) => {
    onChange({z: value});
  }, [onChange]);

  return (
    <BaseControl
      {...baseProps}
      labelPlacement="start"
      control={
        <FlexRow>
          <Vec3NumberControl
            {...controlProps}
            vec={value}
            attrib='x'
            onChange={onXChange}
          />
          <Vec3NumberControl 
            {...controlProps}
            vec={value}
            attrib='y'
            onChange={onYChange}
          />
          <Vec3NumberControl 
            {...controlProps}
            vec={value}
            attrib='z'
            onChange={onZChange}
          />
        </FlexRow>
      }
    />
  );
}

interface Vec3NumberControlProps extends NumberBaseControlProps{
  vec: Vec3;
  attrib: keyof Vec3;
  onChange?: (value: number) => void;
}

const Vec3NumberControl = observer((props: Vec3NumberControlProps) => {
  const {vec, attrib, onChange, ...otherProps} = props;
  return (
    <NumberControlMemo {...otherProps} value={vec[attrib]} onChange={onChange}/>
  )
});


const NumberControlMemo = React.memo((props: NumberControlProps) => {
  return <NumberControl {...props}/>
}, (prevProps, nextProps) => {
  const equals = Math.abs(prevProps.value - nextProps.value) < 1e-5 &&
    prevProps.onChange === nextProps.onChange
  return equals;
});