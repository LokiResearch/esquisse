// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 29/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import {MenuList} from '@mui/material';
import * as Icons from '/ui/Icons';
import { ResizableView } from '../base/views/ResizableView';
import { emToPx } from '/utils/conversion';
import { PanelItem } from './panes/base/PanelItem';
import { LibraryPane } from './panes/LibraryPane';
import { RenderPane } from './panes/RenderPane';
import { ScenePane } from './panes/ScenePane';
import { SettingsPane } from './panes/SettingsPane';

const EXPANDED_WIDTH = emToPx(18);
const COLLAPSED_WIDTH = emToPx(4);

interface Props {
  defaultExpanded: boolean;
}

interface State {
  expanded: boolean;
}

export class MainPanel extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: this.props.defaultExpanded,
    }
  }

  onExpandedChanged = (expanded: boolean) => {
    this.setState({
      expanded: expanded
    })
  }

  render() {

    return (
      <ResizableView 
        position="left" 
        expandedWidth={EXPANDED_WIDTH} 
        collapsedWidth={COLLAPSED_WIDTH} 
        defaultExpanded={this.props.defaultExpanded}
        collapseIcon={Icons.OpenCloseMenuIcon}
        expandIcon={Icons.OpenCloseMenuIcon}
        button='internal'
        onExpandedChanged={this.onExpandedChanged}
      >
        <MenuList dense={true}>
          <PanelItem icon={Icons.LibrarySettingsIcon} title="Library"
            menuExpanded={this.state.expanded} defaultExpanded={true}>
            <LibraryPane/>
          </PanelItem>
          <PanelItem icon={Icons.RenderSettingsIcon} title="Render"
            menuExpanded={this.state.expanded} defaultExpanded={true}>
            <RenderPane/>
          </PanelItem>
          <PanelItem icon={Icons.SceneSettingsIcon} title="Scene"
            menuExpanded={this.state.expanded} defaultExpanded={true}>
            <ScenePane/>
          </PanelItem>
          <PanelItem icon={Icons.SettingsIcon} title="Settings"
            menuExpanded={this.state.expanded} defaultExpanded={true}>
            <SettingsPane/>
          </PanelItem>

        </MenuList>
      </ResizableView>
    );
  }
}
