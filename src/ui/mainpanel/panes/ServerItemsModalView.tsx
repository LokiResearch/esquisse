// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 02/05/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md


import React from 'react';
import {Modal, Paper, Card, CardActionArea, CardMedia, Typography, CardContent
} from '@mui/material';
import {GridView} from '../../base/views';
import {ServerItemData} from '/io/ioTypes';

const styles = {
  root: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    outline: 0,
  }
}

interface ServerItemsModalViewProps {
  items: Array<ServerItemData>;
  open: boolean;
  onClose: () => void;
  onItemSelected: (data: ServerItemData) => void;
}

export const ServerItemsModalView = (props: ServerItemsModalViewProps) => {

  const {open, items, onClose, onItemSelected} = props;

  const cards = items.map((data, index) => {
    const onClick = () => {
      onItemSelected(data);
    }
  
    return (
      <ServerItemCard data={data} key={index+data.name} onClick={onClick}/>
    );
  });

  return(
    <Modal
      open={open}
      onClose={onClose}
    >
      <Paper sx={styles.root} variant='outlined'>
        <GridView defaultRowSize={4}>
          {cards}
        </GridView>
      </Paper>
    </Modal>
  );
  
}

interface ServerItemCardProps {
  data: ServerItemData;
  onClick: () => void;
}

const ServerItemCard = (props: ServerItemCardProps) => {

  const {data, onClick} = props;

  // Remove file extension
  const name = data.name.split('.').slice(0, -1);

  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height="140"
          image={data.image}
        />
        <CardContent>
          <Typography variant="h5">
            {name}
          </Typography>
          <Typography color="text.secondary">
            {data.url.replace('http://', '')}
          </Typography>
        </CardContent>
      </CardActionArea>

    </Card>
  )

}



