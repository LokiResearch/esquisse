// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 08/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import {Typography, Box, ListItem, List} from '@mui/material';

const styles = {
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  list: {
    marginTop: '0.1em',
    paddingTop: '0.1em',
    marginBottom: '0.1em',
    paddingBottom: '0.1em',
  }
};

interface ListViewProps {
  label?: string
  width: number | string;
  height: number;
  itemSize: number;
  children: JSX.Element[]
}

export const ListView = (props: ListViewProps) => {

  const {label, children} = props;

  const listItems = children.map((item, index) => {return (
    <ListItem key={index}>
      {item}
    </ListItem>
  )});

  return (
    <Box sx={styles.root}>
        <Typography>
          {label}
        </Typography>
        <List dense>
          {listItems}
        </List>
    </Box>
  );
}
