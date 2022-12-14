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
import {Grid, Box, Slider, Typography} from '@mui/material';

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  gridBox: {
    position: 'absolute',
    top: '2em',
    bottom: 0,
    width: '100%',
    overflowY: 'scroll',
  },
  sliderBox: {
    position: 'absolute',
    right: '1em',
    display: 'flex',
    alignItems: 'center',
  },
  slider: {
    marginLeft: '2em',
    width: '10em',
  },
  noDataMessage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
}

interface Props {
  children: Array<JSX.Element>;
  defaultRowSize: number;
}

interface State {
  rowSize: number;
}

export class GridView extends React.Component<Props, State> {

  readonly spacing = 1;

  constructor(props: Props) {
    super(props);

    this.state = {
      rowSize: props.defaultRowSize ?? 4,
    }
  }

  nRowChanged = (_event: Event, value: number | Array<number>) => {
    this.setState({
      rowSize: value as number
    });
  }

  render() {

    // Display a message that no data is available
    if (this.props.children.length == 0) {
      return (
        <Typography variant="h5" sx={styles.noDataMessage}>
          No data available
        </Typography>
      );
    }

    // Put each item in a grid item with one column wide
    const gridItems = this.props.children.map((child, index) => {
      return (
        <Grid item xs={1} key={"griditem-"+index}>
          {child}
        </Grid>
      );
    });

    return (

      <Box sx={styles.root}>
        <Box sx={styles.sliderBox}>
          <Typography variant="caption" id="track-inverted-slider">
            Items per row
          </Typography>
          <Slider
            sx={styles.slider}
            defaultValue={this.props.defaultRowSize}
            step={1}
            marks
            min={4}
            max={10}
            valueLabelDisplay="auto"
            onChange={this.nRowChanged}
          />
        </Box>
        <Box sx={styles.gridBox}>
          <Grid
            container
            spacing={this.spacing}
            columns={this.state.rowSize}
          >
            {gridItems}
          </Grid>
        </Box>
      </Box>
    )
  }
}