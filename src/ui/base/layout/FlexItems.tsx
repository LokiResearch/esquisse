// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 06/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import {Box, BoxProps} from '@mui/material';

export const FlexRow = (props: BoxProps) => {
  return (
    <Box 
      display='flex'
      flexDirection='row'
      justifyContent='space-between'
      width='100%'
      {...props}
    />
  );
}

export const FlewColumn = (props: BoxProps) => {
  return (
    <Box 
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      width='100%'
      {...props}
    />
  );
}