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
import {SvgIcon, Typography} from '@mui/material';


const styles = {
  icon: {
    fontSize: '0.9rem',
    paddingRight: '0.3em',
  }
};


export interface AccordionViewProps extends AccordionViewBaseProps {
  icon?: typeof SvgIcon;
}

export const AccordionView = (props: AccordionViewProps) => {

  const {title, icon: Icon, ...otherProps} = props;

  return (
    <AccordionViewBase
      {...otherProps}
      header={(
        <>
          {Icon && <Icon sx={styles.icon} color="primary"/>}
          <Typography>
            {title}
          </Typography>
        </>
      )}
    />
  );
}
