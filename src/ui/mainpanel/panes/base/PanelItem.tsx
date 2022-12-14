

import React from 'react';
import {Paper, MenuItem, Popper, ListItemIcon, ListItemText, Fade, Divider,
  SvgIcon, Box, Tooltip} from '@mui/material';
import {ExpandLessIcon, ExpandMoreIcon} from '/ui/Icons';
// import Tooltip from '/ui/base/Tooltip';

const styles = {
  root: {
    marginBottom: '0.4em',
    // background: 'action.disabledBackground'
  },
  item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  content: {
    margin: '0.3em',
  },
  divider: {
    marginLeft: '1em',
    marginRight: '1em',
    background: 'action.selected',
  },
  popper: {
    width: '16em',
    transform: 'translateX(0.5em)',
    margin: '0.3em',
  }
};

interface Props {
  icon: typeof SvgIcon;
  title: string;
  defaultExpanded?: boolean;
  menuExpanded: boolean;
  noPopper?: boolean;
  noHeader?: boolean;
  children?: React.ReactNode;
}

interface State {
  expanded: boolean;
  popperAnchor: HTMLElement | null;
}

export class PanelItem extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: this.props.defaultExpanded || this.props.noHeader || false,
      popperAnchor: null,
    }
  }

  onClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.props.menuExpanded) {
      this.setState(state => ({
        expanded: !state.expanded,
      }))
    } else {
      const currentTarget = event.currentTarget;
      this.setState(state => ({
        popperAnchor: state.popperAnchor ? null : currentTarget,
      }))
    }
  }

  componentDidUpdate(previousProps: Props) {
    if (this.props.menuExpanded != previousProps.menuExpanded) {
      this.setState({
        popperAnchor: null
      });
    }
  }

  render() {

    const ExpandIcon = this.state.expanded? ExpandLessIcon : ExpandMoreIcon;
    const MenuIcon = this.props.icon;
    const selected = !this.state.expanded && this.state.popperAnchor != null;

    return (
      <Paper sx={styles.root} variant='outlined'>
        {!this.props.noHeader &&
          <Tooltip title={this.props.title} placement="right" disableHoverListener={this.props.menuExpanded}>
            <MenuItem sx={styles.item} onClick={this.onClick} selected={selected}>
              <ListItemIcon>
                <MenuIcon/>
              </ListItemIcon>
              <ListItemText primary={this.props.title} hidden={!this.props.menuExpanded}/>
              <ExpandIcon/>
            </MenuItem>
          </Tooltip>
        }
        {(this.props.menuExpanded && this.state.expanded) && (
          <React.Fragment>
            {!this.props.noHeader && <Divider sx={styles.divider}/>}
            <Box sx={styles.content}>
              {this.props.children}
            </Box>
          </React.Fragment>
        )}
        {!this.props.noPopper && (
          <Popper open={Boolean(this.state.popperAnchor)} 
            anchorEl={this.state.popperAnchor} 
            placement='right-start' transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper sx={styles.popper} variant="outlined" elevation={3}>
                  {this.props.children}
                </Paper>
              </Fade>
            )}
          </Popper>)
        }
      </Paper>
    );
  }
}