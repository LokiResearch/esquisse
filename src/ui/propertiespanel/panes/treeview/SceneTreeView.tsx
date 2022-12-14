// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 23/08/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import { TreeView }  from '@mui/lab';
import { SceneTreeItem } from './SceneTreeItem';
import { useEditorContext } from '/editor/Editor';
import { BlankIcon } from '/ui/Icons';
import { AddCard, ArrowDropDown, ArrowRight, UnfoldLess, UnfoldMore } from '@mui/icons-material';
import { SelectCommand, DeleteSelectionCommand, AddObjectsCommand, GroupObjectsCommand } from '/commands';
import { FlexRow } from '../../../base/layout/FlexItems';
import { IconButton, Menu, MenuItem, MenuProps, PopoverPosition, Tooltip } from '@mui/material';
import { EObject, EBone, EGroup } from '/objects';


const styles = {
  expandIcon: {
    fontSize: '1rem'
  },
  treeView: {
    padding: '0.1em',
  }
};

export const SceneTreeView = React.memo(() => {

  const editor = useEditorContext();
  const [tree, setTree] = React.useState({root: editor.scene});
  const [selected, setSelected] = React.useState(editor.selectedObjects.map(o=>String(o.id)));
  const [expanded, setExpanded] = React.useState([String(editor.scene.id)]);
  const [contextMenuPos, setContextMenuPos] = React.useState<PopoverPosition|undefined>(undefined);

  // Rebuild TreeView when the scene graph changes
  React.useEffect(() => {

    const updateTree = () => {
      setTree({root: editor.scene});
    }

    editor.signals.sceneGraphUpdated.connect(updateTree);
    return () => {
      editor.signals.sceneGraphUpdated.disconnect(updateTree);
    }
  }, []);

  // Update the selection when the scene selection changes
  React.useEffect(() => {
    
    const updateSelection = () => {
      const ids = editor.selectedObjects.map(o => String(o.id));
      const sameIds = selected.length === ids.length && 
                      selected.every(e => ids.includes(e));
      if (!sameIds) {
        setSelected(ids);
      }
    }

    editor.signals.selectionChanged.connect(updateSelection);
    return () => {
      editor.signals.selectionChanged.disconnect(updateSelection);
    }
  }, []);

  // Component keyboard shortcuts when focused
  const onKeyDown = (event: React.KeyboardEvent) => {
    // Delete selection
    if (event.key == "Backspace") {
      const cmd = new DeleteSelectionCommand(editor, !event.shiftKey);
      cmd.exec();
    }
  }


  const onExpandAll = () => {
    const ids = new Array<string>();
    editor.scene.traverse(e => {
      if (e.showInExplorer && !(e as EBone).isBone) {
        ids.push(String(e.id));
      }
    })
    setExpanded(ids);
  }

  const onCollapseAll = () => {
    setExpanded([String(editor.scene.id)])
  }

  const onNodeToggle = (_event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  }

  /**
   * Called when items are selected. We send a select command.
   * @param _event 
   * @param nodeIds 
   */
  const onNodeSelect = (_event: React.SyntheticEvent, nodeIds: string[]) => {

    setSelected(nodeIds);

    const objects = new Array<EObject>();
    for (const nodeId of nodeIds) {
      const obj = editor.scene.getObjectById(Number(nodeId));
      if (obj) {
        objects.push(obj);
      }
    }

    const cmd = new SelectCommand(editor, objects, false);
    cmd.exec();
  }

  const onAddGroup = () => {

    const group = new EGroup();
    group.name = "Group";
    const cmd = new AddObjectsCommand(editor, group);
    cmd.exec();
  }

  const showContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuPos({left: event.clientX, top: event.clientY});
  }

  const hideContextMenu = () => {
    setContextMenuPos(undefined);
  }

  const displayTree = React.useMemo(() => {

    const renderTree = (obj: EObject) => {
      const children = obj.children
        .filter(obj => obj.showInExplorer)
        .sort((a,b) => a.id-b.id);
      const childTrees = children.map(child => renderTree(child));

      return (
        <SceneTreeItem object={obj} key={obj.id} 
          nodeId={String(obj.id)}
          onContextMenu={showContextMenu}
        >
          {childTrees}
        </SceneTreeItem>
      )
    }
    return renderTree(tree.root);
  }, [tree]);

  
  const selectedObjects = new Array<EObject>();
  selected.forEach(id => {
    const obj = editor.scene.getObjectById(Number(id));
    if (obj) {
      selectedObjects.push(obj);
    }
  });


  return (
    <>
      <FlexRow justifyContent="end">
        <IconButton onClick={onExpandAll} color='primary'>
          <Tooltip title="Expand tree">
            <UnfoldMore fontSize='small'/>
          </Tooltip>
        </IconButton>
        <IconButton onClick={onCollapseAll} color='primary'>
          <Tooltip title="Collapse tree">
            <UnfoldLess fontSize='small'/>
          </Tooltip>
        </IconButton>
        <IconButton onClick={onAddGroup} color='primary'>
          <Tooltip title="Add group">
            <AddCard fontSize='small'/>
          </Tooltip>
        </IconButton>
      </FlexRow>
      <TreeView
        id="SceneTreeView"
        sx={styles.treeView}
        // This line removes keydown support for treeview but add DnD
        // See https://github.com/mui/material-ui/issues/29518#issuecomment-990760866
        onFocusCapture={e => e.stopPropagation()}
        multiSelect
        onKeyDown={onKeyDown}
        defaultCollapseIcon={<ArrowDropDown sx={styles.expandIcon}/>}
        defaultExpandIcon={<ArrowRight sx={styles.expandIcon}/>}
        defaultEndIcon={<BlankIcon sx={styles.expandIcon}/>}
        expanded={expanded}
        selected={selected}
        onNodeSelect={onNodeSelect}
        onNodeToggle={onNodeToggle}
      >
        {displayTree}
      </TreeView>
      <ContextMenu 
        open={contextMenuPos !== undefined}
        anchorReference='anchorPosition'
        anchorPosition={contextMenuPos}
        onClose={hideContextMenu}
        selectedObjects={selectedObjects}
      />
    </>
  );
});

interface ContextMenuProps extends MenuProps{
  selectedObjects: EObject[];
}

const ContextMenu = (props: ContextMenuProps) => {

  const {selectedObjects, ...baseProps} = props;
  const editor = useEditorContext();
  // const onClose = props.onClose;

  const onGroupItemClick = () => {
    const cmd = new GroupObjectsCommand(editor, selectedObjects);
    cmd.exec();
  }

  return (
    <Menu {...baseProps}>

      {selectedObjects.length > 0 &&
        <MenuItem onClick={onGroupItemClick}>
          Group objects
        </MenuItem>
      }
    </Menu>
  );
}

