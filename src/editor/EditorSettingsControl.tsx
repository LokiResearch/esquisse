/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Mon Oct 03 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import React from 'react';
import { BooleanControl, BooleanControlProps, ColorControl, ColorControlProps, NumberControl, NumberControlProps } from '/ui/base/controls';
import { BaseControlProps } from '../ui/base/controls/BaseControl';
import { makeObservable, observable, action } from 'mobx';
import { observer } from 'mobx-react-lite';

/**
 * Base Setting class that embeds the BaseControlProps<T> properties as
 * attributes.
 * 
 * @example
 * ```ts
 * interface A {}
 * interface B extends A {}
 * class B {
 *  constructor(params: A) {}
 * }
 * ```
 * In Typescript makes the declared properties of `interface A`, declared properties 
 * of `class B` as well, but not initialized. For that, we just need to pass 
 * an object of type `ìnterface A` to `contructor of B` and assign props.
 * 
 */

interface BaseSettingsProps<T> extends BaseControlProps {
  value: T;
  onChange?: (value: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Setting<T> extends BaseSettingsProps<T> {}
export abstract class Setting<T> {
  constructor(params: BaseSettingsProps<T>) {
    // Assign all the values of params to this
    Object.assign(this, params);
    // Tells mobx we want to observe the value property (taken from the
    // BaseControlProps properties)
    makeObservable(this, {
      value: observable,
      setValue: action,
    });

    // Set the callback to update the mobx value automatically
    this.onChange = (value: T) => {
      params.onChange && params.onChange(value);
      this.setValue(value);
    }
  }
  
  // Sets the value of the setting
  setValue(value: T) {
    console.log("Updated setting", this.label, value)
    this.value = value;
  }
}

/**
 * Class that embeds the `BooleanControlProps` properties.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BooleanSetting extends BooleanControlProps {}
export class BooleanSetting extends Setting<boolean> {
  constructor(params: BooleanControlProps) {
    super(params);
  }
}

/**
 * Boolean setting control component that takes a `BooleanSetting` object as props;
 * 
 * Used to deference the value property (that is a mobx observable)
 * in **this** component and avoid re-render of parent component that use it.
 * @param props 
 * @returns 
 */
export const BooleanSettingControl = observer(
  (props: {setting: BooleanSetting, disabled?: boolean}) => {
    const disabled = props.setting.disabled ?? props.disabled;
    return <BooleanControl {...props.setting} disabled={disabled}/>;
  }
);


/**
 * Class that embeds the `NumberControlProps` properties.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NumberSetting extends NumberControlProps {}
export class NumberSetting extends Setting<number> {
  constructor(params: NumberControlProps) {
    super(params);
  }
}

/**
 * Number setting control component that takes a `NumberSetting` object as props;
 * 
 * Used to deference the value property (that is a mobx observable)
 * in **this** component and avoid re-render of parent component that use it.
 * @param props 
 * @returns 
 */
export const NumberSettingControl = observer(
  (props: {setting: NumberSetting, disabled?: boolean}) => {
    const disabled = props.setting.disabled ?? props.disabled;
    return <NumberControl {...props.setting} disabled={disabled}/>;
  }
);

/**
 * Class that embeds the `ColorControlProps` properties.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ColorSetting extends ColorControlProps {}
export class ColorSetting extends Setting<string> {
  constructor(params: ColorControlProps) {
    super(params);
  }
}

/**
 * Color setting control component that takes a `ColorSetting` object as props;
 * 
 * Used to deference the value property (that is a mobx observable)
 * in **this** component and avoid re-render of parent component that use it.
 * @param props 
 * @returns 
 */
export const ColorSettingControl = observer(
  (props: {setting: ColorSetting, disabled?: boolean}) => {
    const disabled = props.setting.disabled ?? props.disabled;
    return <ColorControl {...props.setting} disabled={disabled}/>;
  }
);



