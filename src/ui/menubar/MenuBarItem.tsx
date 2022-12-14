// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 18/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import * as React from 'react';
import {MenuItem, ListItemText, ListItemIcon, Divider, SvgIcon, Typography,
  ListItemSecondaryAction, styled
} from '@mui/material';
import {MenuBarList} from './MenuBarList';
import {MenuBarItemExpandIcon, BlankIcon} from '/ui/Icons';

const StyledMenuItem = styled(MenuItem)({
  marginTop: '0.0em',
  marginBottom: '0.0em',
  paddingTop: "0",
  paddingBottom: "0",
});

const StyledListItemIcon = styled(ListItemIcon)({
  root: {
    margin:'0',
    padding:'0',
  },
});

const StyledDivider = styled(Divider)(({theme}) => ({
  background: theme.palette.action.active
}));


export interface Item {
  type: 'separator' | 'action' | 'list' | 'listHeader';
  name?: string;
  icon?: typeof SvgIcon;
  action?: (()=>void);
  shortcut?: string;
  subitems?: Item[];
}

interface MenuBarItemProps {
  item: Item;
  onClick?: ((e: React.SyntheticEvent<HTMLElement>) => void);
  onPointerEnter?: ((e: React.PointerEvent<HTMLElement>) => void);
  onPointerLeave?: ((e: React.PointerEvent<HTMLElement>) => void);
}

export class MenuBarItem extends React.Component<MenuBarItemProps> {

  onClick = (e: React.SyntheticEvent<HTMLElement>) => {
    if (this.props.item.type === 'action') {
      if (this.props.item.action) {
        this.props.item.action();
      } else {
        console.warn("MenuItem ["+this.props.item.name+"] has no action.");
      }
    }
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {

    const Icon = this.props.item.icon ?? BlankIcon;
    const shortcut = this.props.item.shortcut ?? "";

    if (this.props.item.type === 'action') {
      return (
        <StyledMenuItem onClick={this.onClick}>
          <StyledListItemIcon>
            <Icon fontSize='small'/>
          </StyledListItemIcon>
          <ListItemText style={{margin:0, padding:0}}>
            {this.props.item.name}
          </ListItemText>
          <Typography variant="body2" color="text.secondary">
            {shortcut}
          </Typography>
        </StyledMenuItem>
      );
    } else if (this.props.item.type === "list") {
      const name = this.props.item.name ? this.props.item.name : '<name>';
      const subitems = this.props.item.subitems ? this.props.item.subitems : [];
      return (
        <MenuBarList items={subitems} name={name} primary={false}/> 
      )
    } else if (this.props.item.type === "listHeader") {
      return (
        <StyledMenuItem onClick={this.onClick}>
          <StyledListItemIcon>
            <Icon fontSize='small'/>
          </StyledListItemIcon>
          <ListItemText style={{margin:0, padding:0}}>
            {this.props.item.name}
          </ListItemText>
          <ListItemSecondaryAction>
            <MenuBarItemExpandIcon fontSize='small'/>
          </ListItemSecondaryAction>  
        </StyledMenuItem>
      );
    } else {
      return (
        <StyledDivider light/>
      );
    }
  }
}




