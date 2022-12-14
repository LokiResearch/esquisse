// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 06/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import * as React from 'react';
import {Paper, IconButton, Box, SvgIcon, SxProps} from '@mui/material';

const styles = {
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 0,
    height: '100%',
    flex: 'none',
    overflowY: 'scroll',
    overflowX: 'clip',
  },
  fakeBar: {
    width: '3px',
    flex: 'none',
  },
  resizableBar: {
    width: '3px',
    '&:hover': {
      cursor: 'ew-resize',
    },
    flex: 'none',
  },
  content: {
    flexGrow: 1,
    minWidth: 0
  },
  buttonLeft: {
    top:'0.5em',
    marginLeft: 'auto',
    marginRight: '0.5em',
    marginBottom: '0.5em',
  },
  buttonRight: {
    position: 'absolute',
    top: '0.5em',
    left: '-0.5em',
    transform: 'translateX(-100%)',
  },
  box: {
    display: 'flex',
  }
} as const;

interface Props {
  sx?: SxProps;
  children?: React.ReactNode;
  position: "left" | "right";
  button: "internal" | "external";
  collapseIcon: typeof SvgIcon;
  expandIcon: typeof SvgIcon;
  expandedWidth: number;
  collapsedWidth: number;
  defaultExpanded: boolean;
  onExpandedChanged?: (expanded: boolean) => void;
}

interface State {
  width: number;
  expandedWidth: number;
  expanded: boolean;
}

export class ResizableView extends React.Component<Props, State> {
  mouseStartX = 0;
  widthStart = 0;

  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: this.props.defaultExpanded,
      width: this.props.defaultExpanded ? this.props.expandedWidth : this.props.collapsedWidth,
      expandedWidth: this.props.expandedWidth,
    }
  }

  onResizeBarDown = (e: MouseEvent) => {
    if (!this.state.expanded) {
      return;
    }

    this.mouseStartX = e.clientX;
    this.widthStart = this.state.width
    window.addEventListener("mousemove", this.onResizeBarMove);
    window.addEventListener("mouseup", this.onResizeBarUp);
    document.body.style.cursor = "ew-resize";
    e.preventDefault();
  }

  onResizeBarMove = (e: MouseEvent) => {
    const factor = this.props.position === 'left' ? 1 : -1;
    let newWidth = this.widthStart + factor*(e.clientX - this.mouseStartX);
    newWidth = Math.max(newWidth, this.props.expandedWidth);
    this.setState({
      width: newWidth, 
      expandedWidth: newWidth
    });
    e.preventDefault();
  }

  onResizeBarUp = (e: MouseEvent) => {
    window.removeEventListener("mousemove", this.onResizeBarMove);
    window.removeEventListener("mouseup", this.onResizeBarUp);
    document.body.style.cursor = "default";
    e.preventDefault();
  }

  onClick = () => {
    this.setState((state) => ({
      expanded: !state.expanded,
      width: !state.expanded ? this.state.expandedWidth : this.props.collapsedWidth
    }), () => {
      if (this.props.onExpandedChanged) {
        this.props.onExpandedChanged(this.state.expanded);
      }
    });
  }

  render() {

    const resizeBar = <Box sx={styles.resizableBar}
      onMouseDown={(e) => {this.onResizeBarDown(e.nativeEvent)}}
    />
    const fakeBar = <Box sx={styles.fakeBar}/>

    let ButtonIcon = this.props.expandIcon;
    if (this.state.expanded) {
      ButtonIcon = this.props.collapseIcon;
    } 

    let leftBar = fakeBar;
    let rightBar = resizeBar;
    let buttonStyle: any = styles.buttonLeft;
    if (this.props.position === 'right') {
      leftBar = resizeBar;
      rightBar = fakeBar;
      buttonStyle = styles.buttonRight;
    }

    return (
      <Paper sx={{
        ...styles.root,
        width: this.state.width,
        ...this.props.sx
      }}>
        {leftBar}
        <Box sx={styles.content}>
          <Box sx={styles.box}>
            <IconButton sx={buttonStyle} size="small" onClick={this.onClick}>
              <ButtonIcon/>
            </IconButton>
          </Box>
          {this.props.children}
        </Box>
        {rightBar}
      </Paper>
    );
  }
}