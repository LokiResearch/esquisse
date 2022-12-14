// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 09/16/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 
import React from 'react';
import { AccordionViewBase, AccordionViewBaseProps } from './AccordionViewBase';
import { BooleanControl, BooleanControlProps } from '../../controls';

export interface ActivableAccordionViewProps extends AccordionViewBaseProps {
  controlProps?: BooleanControlProps;
}

export const ActivableAccordionView = (props: ActivableAccordionViewProps) => {

  const {controlProps, children, tooltip, title, ...otherProps} = props;

  const {onClick, onChange, value: checked, tooltip: boolTooltip, label: boolLabel,
    ...otherControlProps} = controlProps ?? {value: false};

  const [enabled, setEnable] = React.useState(checked);

  const onControlClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    onClick && onClick(event);
  }

  const onControlChange = (value: boolean) => {
    setEnable(value);
    onChange && onChange(value);
  }

  /**
   * Pass "disabled" props to child component when the checkbox value changes
   */
  const newChildren = React.Children.map(children, el => {
    if (React.isValidElement(el)) {
      return React.cloneElement(el, { disabled: !enabled } as any);
    }
    return el;
  }) as NonNullable<React.ReactNode>;

  return (
    <AccordionViewBase
      {...otherProps}
      tooltip={boolTooltip || tooltip}
      children={newChildren}
      header={(
        <BooleanControl 
          {...otherControlProps}
          label={boolLabel || title}
          value={enabled}
          onClick={onControlClick}
          onChange={onControlChange}
        />
      )}
    />
  );
}

