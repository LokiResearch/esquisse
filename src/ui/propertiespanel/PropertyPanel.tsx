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
import {ResizableView} from '../base/views/ResizableView';
import {emToPx} from '/utils/conversion';
import {MenuList} from '@mui/material';
import * as Icons from '/ui/Icons';
import {PanelItem} from '../mainpanel/panes/base/PanelItem';
import {SceneTreeView} from './panes/treeview/SceneTreeView';
import { useEditorContext } from '/editor/Editor';
import { ObjectInfoPane } from './panes/ObjectInfoPane';

const EXPANDED_WIDTH = emToPx(18);
const COLLAPSED_WIDTH = emToPx(0);

interface PropertiesPanelProps {
  defaultExpanded: boolean;
}

export const PropertiesPanel = (props: PropertiesPanelProps) => {

  const editor = useEditorContext();
  const {defaultExpanded} = props

  const [selectedObjects, setSelectedObjects] = React.useState([...editor.selectedObjects]);

  // Suscribe to the selection changes
  React.useEffect(() => {
    
    const updateSelection = () => {
      setSelectedObjects([...editor.selectedObjects]);
    }

    editor.signals.selectionChanged.connect(updateSelection);

    return () => {
      editor.signals.selectionChanged.disconnect(updateSelection);
    };
  }, []);

  return (
    <ResizableView 
      position="right" 
      expandedWidth={EXPANDED_WIDTH} 
      collapsedWidth={COLLAPSED_WIDTH} 
      defaultExpanded={defaultExpanded}
      collapseIcon={Icons.ExpandRightIcon}
      expandIcon={Icons.ExpandLeftIcon}
      button='external'
      sx={{
        overflowY: "scroll"
      }}
    >
      <MenuList dense={true}>
        <PanelItem icon={Icons.SceneGraphIcon} title="" noPopper noHeader menuExpanded={true}>
          <SceneTreeView/>
        </PanelItem>
        {selectedObjects.length > 0 && 
          <PanelItem icon={Icons.SceneGraphIcon} title="" noPopper noHeader menuExpanded={true}>
            <ObjectInfoPane objects={selectedObjects}/>
          </PanelItem>
        }
      </MenuList>
    </ResizableView>
  );
}