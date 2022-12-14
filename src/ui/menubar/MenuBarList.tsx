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
import {MenuBarItem, Item} from './MenuBarItem';
import {Button, Menu, MenuList} from '@mui/material';

const styles = {
  menu: {
    width: '15em',
    maxWidth: '100%',
    padding: '0',
    margin: '0',
  },
  menuList: {
    width: '15em',
    maxWidth: '100%',
    padding: '0',
    margin: '0',
  }
};

interface MenuBarListProps {
  items: Array<Item>;
  name: string;
  primary: boolean;
}

interface MenuBarListState {
  anchorEl: null | HTMLElement;
}

export class MenuBarList extends React.Component
    <MenuBarListProps, MenuBarListState> {

  constructor(props: MenuBarListProps) {
    super(props);
    this.state = {
      anchorEl: null,
    }
  }

  onClick = (event: React.SyntheticEvent<HTMLElement>) => {
    this.setState({
      anchorEl: event.currentTarget,
    })
  }

  onClose = () => {
    this.setState({
      anchorEl: null,
    })
  }

  render() {
    let itemsJSX = this.props.items.map((item, index) => {
      return <MenuBarItem item={item} key={index} onClick={this.onClose}/>
    });

    let element;
    if (this.props.primary) {
      element = (
        <Button size="small" aria-controls="simple-menu" aria-haspopup="true" onClick={this.onClick}>
          {this.props.name}
        </Button>
      );
    } else {
      element = (
        <MenuBarItem item={{type: 'listHeader', name:this.props.name}}
          onClick={this.onClick}/>
      );
    }

    return (
      <div>
        {element}
        <Menu
          id="simple-menu"
          sx={styles.menu}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          keepMounted
          onClose={this.onClose}
          anchorOrigin={{
            vertical: this.props.primary ? 'bottom' : 'top',
            horizontal: this.props.primary ? 'left' : 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList sx={styles.menuList} dense>
            {itemsJSX}
          </MenuList>
        </Menu>
      </div>
    );
  }
}


